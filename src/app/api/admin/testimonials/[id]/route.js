import { NextResponse } from 'next/server';
import Testimonial from '@/models/Testimonial';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    await Testimonial.update(body, { where: { id } });
    
    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await Testimonial.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
