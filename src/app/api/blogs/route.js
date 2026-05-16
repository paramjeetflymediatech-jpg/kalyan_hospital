import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const blogs = await Blog.findAndCountAll({
      where: { status: 'published' },
      order: [['published_at', 'DESC']],
      limit,
      offset
    });

    return NextResponse.json({ 
      success: true, 
      data: blogs.rows,
      total: blogs.count,
      limit,
      offset
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
