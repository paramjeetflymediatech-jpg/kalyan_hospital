import Seo from '@/models/Seo';

/**
 * Parses a string of HTML and extracts script and noscript tags.
 * This is used to render scripts in a way that is compatible with Next.js hydration.
 */
export function parseScriptTags(html) {
  if (!html) return [];
  const tags = [];
  const regex = /<(script|noscript)([^>]*)>([\s\S]*?)<\/\1>/gm;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const tagName = match[1];
    const attrString = match[2];
    const content = match[3];
    
    const attrs = {};
    const attrRegex = /([a-zA-Z0-9-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const name = attrMatch[1];
      const value = attrMatch[2] || attrMatch[3] || attrMatch[4] || true;
      const reactName = name === 'class' ? 'className' : name;
      attrs[reactName] = value;
    }
    
    tags.push({ tagName, attrs, content });
  }
  return tags;
}

export async function getPageMetadata(path) {
  try {
    const isGlobal = path === 'GLOBAL';
    
    const [pageData, globalData] = await Promise.all([
      isGlobal ? Promise.resolve(null) : Seo.findOne({ where: { page_path: path } }),
      Seo.findOne({ where: { page_path: 'GLOBAL' } })
    ]);

    const page = pageData ? pageData.toJSON() : {};
    const global = globalData ? globalData.toJSON() : {};

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
      // Raw script strings
      global_header: global.header_scripts || '',
      global_footer: global.footer_scripts || '',
      page_header: page.header_scripts || '',
      page_footer: page.footer_scripts || '',
      
      // Separate tags to avoid duplication between layout and pages
      global_header_tags: parseScriptTags(global.header_scripts || ''),
      global_footer_tags: parseScriptTags(global.footer_scripts || ''),
      page_header_tags: parseScriptTags(page.header_scripts || ''),
      page_footer_tags: parseScriptTags(page.footer_scripts || ''),
      
      openGraph: {
        title: page.og_title || global.og_title || title,
        description: page.og_description || global.og_description || description,
        images: ogImage ? [{ url: ogImage }] : [],
        siteName: global.title || 'Kalyan Robotic Hospital',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: page.og_title || global.og_title || title,
        description: page.og_description || global.og_description || description,
        images: ogImage ? [ogImage] : [],
      }
    };
  } catch (error) {
    console.error('Error fetching SEO metadata from MySQL:', error);
    return null;
  }
}
