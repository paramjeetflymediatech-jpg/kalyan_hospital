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
          '/test-route/',
          '/*?_rsc=',
          '/*&_rsc=',
          //'/*?*', // Disallow query strings to prevent duplicate content
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
