import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const blogs = await Blog.findAndCountAll({ 
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    return NextResponse.json({ 
      success: true, 
      data: blogs.rows,
      total: blogs.count 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, slug, excerpt, content, image, author, status, publishedAt, faqs } = body;

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      image,
      author,
      status,
      faqs,
      publishedAt: status === 'published' ? (publishedAt || new Date()) : null
    });

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
