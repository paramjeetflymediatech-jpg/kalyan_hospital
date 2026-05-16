import Service from '@/models/Service';
import Location from '@/models/Location';
import State from '@/models/State';
import ServiceLocation from '@/models/ServiceLocation';
import Blog from '@/models/Blog';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robotickneereplacementinindia.com';

  try {
    // 1. Static/Main Pages
    const staticPages = [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/about`, lastModified: new Date() },
      { url: `${baseUrl}/videos`, lastModified: new Date() },
      { url: `${baseUrl}/blogs`, lastModified: new Date() },
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

    const locationPages = junctions
      .filter(j => j.Location && j.Location.State && j.Service)
      .map((j) => ({
        url: `${baseUrl}/${j.Location.State.slug}/${j.Service.slug}-in-${j.Location.slug}`,
        lastModified: j.updatedAt || new Date(),
      }));

    // 5. Blog Posts
    const blogs = await Blog.findAll({ where: { status: 'published' } });
    const blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || new Date(),
    }));
    
    return [...staticPages, ...locationPages, ...blogPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}
