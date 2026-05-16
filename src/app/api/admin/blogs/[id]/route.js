import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, image, author, status, publishedAt, faqs } = body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    await blog.update({
      title,
      slug,
      excerpt,
      content,
      image,
      author,
      status,
      faqs,
      publishedAt: status === 'published' ? (publishedAt || blog.publishedAt || new Date()) : null
    });

    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    await blog.destroy();
    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
