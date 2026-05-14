import { NextResponse } from 'next/server';
import Service from '@/models/Service';
import Location from '@/models/Location';
import ServiceLocation from '@/models/ServiceLocation';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    console.log("locationId", locationId);

    if (!locationId) {
      return NextResponse.json({ success: false, error: 'locationId is required' }, { status: 400 });
    }

    const location = await Location.findByPk(locationId, {
      include: [{
        model: Service,
        through: { attributes: [] } // Just get the services
      }]
    });

    if (!location) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: location.Services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
