import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    const testimonials = await Testimonial.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });
    return NextResponse.json({ success: true, reviews: testimonials });
  } catch (error) {
    console.error('Testimonials Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
