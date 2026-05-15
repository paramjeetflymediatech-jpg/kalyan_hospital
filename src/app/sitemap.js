import Service from '@/models/Service';
import Location from '@/models/Location';
import State from '@/models/State';
import ServiceLocation from '@/models/ServiceLocation';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robotickneereplacementinindia.com';

  try {
    // 1. Static/Main Pages
    const staticPages = [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/locations`, lastModified: new Date() },
    ];

    // 2. State Pages
    const states = await State.findAll();
    const statePages = states.map((state) => ({
      url: `${baseUrl}/${state.slug}`,
      lastModified: new Date(),
    }));

    // 3. Service Detail Pages (Master Services)
    // We assume they are under /[state]/[service-slug]
    const services = await Service.findAll();
    const servicePages = [];
    for (const state of states) {
      for (const service of services) {
        servicePages.push({
          url: `${baseUrl}/${state.slug}/${service.slug}`,
          lastModified: new Date(),
        });
      }
    }

    // 4. City-Service Location Pages (The dynamic nodes)
    const junctions = await ServiceLocation.findAll({
      include: [
        { model: Service },
        { 
          model: Location,
          include: [{ model: State }]
        }
      ]
    });

    const locationPages = junctions.map((j) => ({
      url: `${baseUrl}/${j.Location.State.slug}/${j.Service.slug}-in-${j.Location.slug}`,
      lastModified: j.updatedAt || new Date(),
    }));

    return [...staticPages, ...statePages, ...servicePages, ...locationPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}
