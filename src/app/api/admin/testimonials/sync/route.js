import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

export async function POST() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId || apiKey === 'your_google_api_key_here') {
    return NextResponse.json({ 
      success: false, 
      message: 'Google Places API configuration missing' 
    }, { status: 400 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ 
        success: false, 
        message: `Google API Error: ${data.status}`,
        details: data.error_message
      }, { status: 400 });
    }

    const reviews = data.result.reviews || [];
    let syncedCount = 0;

    for (const review of reviews) {
      const google_review_id = `${review.author_name}_${review.time}`;
      
      await Testimonial.upsert({
        google_review_id,
        name: review.author_name,
        location: 'Google Review',
        text: review.text,
        image: review.profile_photo_url,
        rating: review.rating,
        time: review.relative_time_description,
        is_active: true
      });
      syncedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} testimonials`,
      rating: data.result.rating,
      total_reviews: data.result.user_ratings_total
    });

  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error during sync',
      error: error.message 
    }, { status: 500 });
  }
}
