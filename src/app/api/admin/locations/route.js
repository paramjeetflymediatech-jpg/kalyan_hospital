import { NextResponse } from 'next/server';
import Location from '@/models/Location';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    const stateId = searchParams.get('stateId');

    const where = {};
    if (districtId) where.district_id = districtId;
    if (stateId) where.state_id = stateId;

    const locations = await Location.findAll({ 
      where,
      order: [['name', 'ASC']] 
    });
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, name, slug, state_id, district_id } = body;

    if (id) {
      await Location.update({ name, slug, state_id, district_id }, { where: { id } });
      return NextResponse.json({ success: true, message: 'Location updated' });
    } else {
      const location = await Location.create({ name, slug, state_id, district_id });
      return NextResponse.json({ success: true, data: location });
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

    await Location.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Location deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
