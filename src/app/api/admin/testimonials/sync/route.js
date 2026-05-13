import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';
import sequelize from '@/lib/db';

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
    await sequelize.sync();

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ 
        success: false, 
        message: `Google API Error: ${data.status}` 
      }, { status: 400 });
    }

    if (!data.result.reviews) {
      return NextResponse.json({ 
        success: false, 
        message: 'No reviews found for this place' 
      }, { status: 404 });
    }

    // Process and store reviews
    const newReviews = data.result.reviews.map(review => ({
      google_review_id: review.time.toString() + review.author_name,
      name: review.author_name,
      location: 'Google Review',
      text: review.text,
      image: review.profile_photo_url || '/patient-placeholder.png',
      score: `${(review.rating * 20).toFixed(1)}%`,
      rating: review.rating,
      time: review.relative_time_description,
      is_active: true
    }));

    let updatedCount = 0;
    for (const reviewData of newReviews) {
      const [instance, created] = await Testimonial.findOrCreate({
        where: { google_review_id: reviewData.google_review_id },
        defaults: reviewData
      });
      if (created) updatedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${newReviews.length} reviews (${updatedCount} new)`,
      totalInDb: await Testimonial.count()
    });

  } catch (error) {
    console.error('Admin Testimonials Sync Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to sync testimonials',
      error: error.message 
    }, { status: 500 });
  }
}
