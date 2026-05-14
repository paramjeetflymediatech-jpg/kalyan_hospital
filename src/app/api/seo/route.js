import { NextResponse } from 'next/server';
import Seo from '@/models/Seo';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const list = searchParams.get('list');

    if (list === 'true') {
      const allSeo = await Seo.findAll({
        attributes: ['page_path', 'title'],
        order: [['page_path', 'ASC']]
      });
      return NextResponse.json({ success: true, data: allSeo });
    }

    const path = searchParams.get('path') || 'GLOBAL';

    let seo = await Seo.findOne({ where: { page_path: path } });
    
    if (!seo && path !== 'GLOBAL') {
      seo = await Seo.findOne({ where: { page_path: 'GLOBAL' } });
    }

    return NextResponse.json({ 
      success: true, 
      data: seo || {
        title: 'Kalyan Robotic Hospital',
        description: 'Advanced Orthopedic Care',
      }
    });
  } catch (error) {
    console.error('SEO Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      page_path, 
      old_path,
      title, 
      description, 
      keywords, 
      og_image, 
      og_title,
      og_description,
      header_scripts, 
      footer_scripts, 
      canonical_url 
    } = body;

    // Handle Rename: If old_path is provided and different, delete the old one
    if (old_path && old_path !== page_path && old_path !== 'GLOBAL') {
      await Seo.destroy({ where: { page_path: old_path } });
    }

    const [seo, created] = await Seo.upsert({
      page_path,
      title,
      description,
      keywords,
      og_image,
      og_title,
      og_description,
      header_scripts,
      footer_scripts,
      canonical_url
    });

    return NextResponse.json({ 
      success: true, 
      message: created ? 'SEO created' : 'SEO updated',
      data: seo 
    });
  } catch (error) {
    console.error('SEO Save Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path || path === 'GLOBAL') {
      return NextResponse.json({ success: false, error: 'Cannot delete this path' }, { status: 400 });
    }

    await Seo.destroy({ where: { page_path: path } });
    return NextResponse.json({ success: true, message: 'SEO metadata deleted' });
  } catch (error) {
    console.error('SEO DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
