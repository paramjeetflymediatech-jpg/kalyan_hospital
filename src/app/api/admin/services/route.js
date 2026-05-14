import { NextResponse } from 'next/server';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const services = await Service.findAll({ order: [['name', 'ASC']] });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, name, slug, description, icon } = body;

    if (id) {
      await Service.update({ name, slug, description, icon }, { where: { id } });
      return NextResponse.json({ success: true, message: 'Service updated' });
    } else {
      const service = await Service.create({ name, slug, description, icon });
      return NextResponse.json({ success: true, data: service });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await Service.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
