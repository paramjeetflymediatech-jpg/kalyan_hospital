import { NextResponse } from 'next/server';
import State from '@/models/State';
import Location from '@/models/Location';
import Service from '@/models/Service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkSlug = searchParams.get('slug');
    
    if (checkSlug) {
      const [s, l, svc] = await Promise.all([
        State.findOne({ where: { slug: checkSlug } }),
        Location.findOne({ where: { slug: checkSlug } }),
        Service.findOne({ where: { slug: checkSlug } })
      ]);
      return NextResponse.json({ s, l, svc });
    }

    const states = await State.findAll({ attributes: ['id', 'name', 'slug'] });
    const locations = await Location.findAll({ attributes: ['id', 'name', 'slug', 'state_id'], limit: 10 });
    const services = await Service.findAll({ attributes: ['id', 'name', 'slug'], limit: 10 });
    
    return NextResponse.json({
      states,
      locations,
      services
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
