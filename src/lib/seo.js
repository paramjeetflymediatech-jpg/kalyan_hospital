import Seo from '@/models/Seo';

export async function getPageMetadata(path) {
  try {
    const isGlobal = path === 'GLOBAL';
    
    // Fetch both page-specific and global metadata
    const [pageData, globalData] = await Promise.all([
      isGlobal ? Promise.resolve(null) : Seo.findOne({ where: { page_path: path } }),
      Seo.findOne({ where: { page_path: 'GLOBAL' } })
    ]);

    const page = pageData ? pageData.toJSON() : {};
    const global = globalData ? globalData.toJSON() : {};

    // Dynamic Fallback Generation for Location Pages
    let defaultTitle = global.title || 'Kalyan Robotic Hospital';
    let defaultDesc = global.description || 'Advanced Orthopedic Care';

    if (!pageData && path.includes('-in-')) {
      const parts = path.replace(/^\//, '').split('-in-');
      if (parts.length === 2) {
        const serviceName = parts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const locationName = parts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        defaultTitle = `Best ${serviceName} in ${locationName} | Kalyan Robotic Hospital`;
        defaultDesc = `Experience precision ${serviceName} with AI-powered robotics in ${locationName}, Punjab. Faster recovery and top surgical expertise at Kalyan Hospital.`;
      }
    }

    // Determine final values
    const title = page.title || defaultTitle;
    const description = page.description || defaultDesc;
    const keywords = [page.keywords, global.keywords].filter(Boolean).join(', ');
    const ogImage = page.og_image || global.og_image || '';
    const canonical = page.canonical_url || global.canonical_url || '';

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonical,
      },
      header_scripts: (global.header_scripts || '') + '\n' + (page.header_scripts || ''),
      footer_scripts: (global.footer_scripts || '') + '\n' + (page.footer_scripts || ''),
      openGraph: {
        title: page.og_title || global.og_title || title,
        description: page.og_description || global.og_description || description,
        images: ogImage ? [{ url: ogImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error fetching SEO metadata from MySQL:', error);
    return null;
  }
}
