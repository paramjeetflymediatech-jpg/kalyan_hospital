import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';
import sequelize from '@/lib/db';

export async function GET() {
  try {
    // Sync database
    await sequelize.sync();

    // Fetch testimonials from the database
    const dbTestimonials = await Testimonial.findAll({
      where: { is_active: true },
      order: [['createdAt', 'DESC']]
    });

    // Map DB records to the format expected by the frontend
    const reviews = dbTestimonials.map(t => ({
      name: t.name,
      location: t.location,
      text: t.text,
      image: t.image || '/patient-placeholder.png',
      score: t.score || `${(t.rating * 20).toFixed(1)}%`,
      recovery: t.recovery,
      rating: t.rating,
      time: t.time
    }));

    return NextResponse.json({ reviews });

  } catch (error) {
    console.error('Testimonials API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch testimonials',
      reviews: [] 
    }, { status: 500 });
  }
}
