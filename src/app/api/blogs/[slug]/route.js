import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const blog = await Blog.findOne({
      where: { slug, status: 'published' }
    });

    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
