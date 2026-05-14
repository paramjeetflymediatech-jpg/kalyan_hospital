import { NextResponse } from 'next/server';
import District from '@/models/District';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('stateId');
    
    const where = stateId ? { state_id: stateId } : {};
    const districts = await District.findAll({ 
      where,
      order: [['name', 'ASC']] 
    });
    return NextResponse.json({ success: true, data: districts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, name, state_id } = await request.json();

    if (id) {
      await District.update({ name, state_id }, { where: { id } });
      return NextResponse.json({ success: true, message: 'District updated' });
    } else {
      const district = await District.create({ name, state_id });
      return NextResponse.json({ success: true, data: district });
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

    await District.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'District deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
