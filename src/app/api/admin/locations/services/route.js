import { NextResponse } from 'next/server';
import ServiceLocation from '@/models/ServiceLocation';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    
    const associations = await ServiceLocation.findAll({ 
      where: { location_id: locationId },
      attributes: ['service_id', 'description', 'content', 'faqs']
    });
    
    return NextResponse.json({ 
      success: true, 
      data: associations
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { locationId, services } = await request.json(); // services: [{ service_id, description, content, faqs }]

    if (Array.isArray(services) && services.length > 0 && typeof services[0] === 'object') {
       // Detail Update
       for (const item of services) {
         await ServiceLocation.update(
           { 
             description: item.description, 
             content: item.content,
             faqs: typeof item.faqs === 'string' ? item.faqs : JSON.stringify(item.faqs || [])
           },
           { where: { location_id: locationId, service_id: item.service_id } }
         );
       }
    } else {
       // Bulk Toggle (IDs)
       const serviceIds = services;
       const existing = await ServiceLocation.findAll({ where: { location_id: locationId } });
       const existingIds = existing.map(e => e.service_id);

       // Remove those not in new list
       await ServiceLocation.destroy({ 
         where: { 
           location_id: locationId,
           service_id: existingIds.filter(id => !serviceIds.includes(id))
         } 
       });

       // Add new ones
       const toAdd = serviceIds.filter(id => !existingIds.includes(id));
       if (toAdd.length > 0) {
         await ServiceLocation.bulkCreate(toAdd.map(id => ({
           location_id: locationId,
           service_id: id,
           faqs: '[]'
         })));
       }
    }

    return NextResponse.json({ success: true, message: 'Services updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
