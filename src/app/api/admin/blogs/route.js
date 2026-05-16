import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const blogs = await Blog.findAll({ order: [['created_at', 'DESC']] });
    return NextResponse.json({ success: true, data: blogs });
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
