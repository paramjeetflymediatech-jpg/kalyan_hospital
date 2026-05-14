import { NextResponse } from 'next/server';
import State from '@/models/State';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const states = await State.findAll({ order: [['name', 'ASC']] });
    return NextResponse.json({ success: true, data: states });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, name } = await request.json();

    if (id) {
      await State.update({ name }, { where: { id } });
      return NextResponse.json({ success: true, message: 'State updated' });
    } else {
      const state = await State.create({ name });
      return NextResponse.json({ success: true, data: state });
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

    await State.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'State deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
