import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['created_at', 'DESC']]
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Testimonials All Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
