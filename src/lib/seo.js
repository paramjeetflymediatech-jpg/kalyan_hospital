import Seo from '@/models/Seo';
import { parseScriptTags } from './script-parser';

export { parseScriptTags };

// In-memory cache for SEO metadata
const seoCache = new Map();

export function clearSeoCache() {
  seoCache.clear();
  console.log('SEO Cache Cleared.');
  warmUpCache();
}

export function getPageMetadataSync(path) {
  return seoCache.get(path) || null;
}

async function fetchMetadataFromDb(path) {
  const isGlobal = path === 'GLOBAL';
  
  const [pageData, globalData] = await Promise.all([
    isGlobal ? Promise.resolve(null) : Seo.findOne({ where: { page_path: path } }),
    Seo.findOne({ where: { page_path: 'GLOBAL' } })
  ]);

  const page = pageData ? pageData.toJSON() : {};
  const global = globalData ? globalData.toJSON() : {};

  const siteName = global.title || 'Kalyan Robotic Hospital';
  const defaultDesc = global.description || 'India’s premier destination for AI-powered robotic knee replacement and spine surgery.';

  // Title logic: if page title exists, append site name as suffix (unless it's the home page or global)
  let title = '';
  if (isGlobal) {
    title = global.title || 'Kalyan Robotic Hospital';
  } else if (path === '/') {
    title = page.title || siteName;
  } else {
    const pageTitle = page.title || (path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    title = page.title ? `${page.title} | ${siteName}` : `${pageTitle} | ${siteName}`;
  }

  if (!pageData && path.includes('-in-')) {
    const parts = path.replace(/^\//, '').split('-in-');
    if (parts.length === 2) {
      const serviceName = parts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const locationName = parts[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      title = `Best ${serviceName} in ${locationName} | ${siteName}`;
      const autoDesc = `Experience precision ${serviceName} with AI-powered robotics in ${locationName}, Punjab. Faster recovery and top surgical expertise at Kalyan Hospital.`;
      if (!page.description) page.description = autoDesc;
    }
  }

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
      title: page.og_title || title,
      description: page.og_description || description,
      images: ogImage ? [{ url: ogImage }] : [],
      siteName: siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.og_title || title,
      description: page.og_description || description,
      images: ogImage ? [ogImage] : [],
    }
  };
}

export async function getPageMetadata(path) {
  try {
    if (seoCache.has(path)) {
      return seoCache.get(path);
    }
    
    const metadata = await fetchMetadataFromDb(path);
    seoCache.set(path, metadata);
    return metadata;
  } catch (error) {
    console.error('Error fetching SEO metadata from MySQL:', error);
    return null;
  }
}

async function warmUpCache() {
  try {
    console.log('Warming up SEO Cache...');
    const records = await Seo.findAll();
    for (const record of records) {
      const metadata = await fetchMetadataFromDb(record.page_path);
      seoCache.set(record.page_path, metadata);
    }
    const globalMetadata = await fetchMetadataFromDb('GLOBAL');
    seoCache.set('GLOBAL', globalMetadata);
    console.log(`SEO Cache warmed up successfully with ${records.length + 1} paths.`);
  } catch (error) {
    console.error('Error warming up SEO cache:', error);
  }
}

// Trigger background cache warmup
warmUpCache();
