export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://robotickneereplacementinindia.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/test-route/',
          '/*?*', // Disallow query strings to prevent duplicate content
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
