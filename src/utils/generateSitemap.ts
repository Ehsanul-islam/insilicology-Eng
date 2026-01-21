/**
 * Sitemap Generator Utility
 * 
 * This utility generates an XML sitemap for better SEO and search engine crawling.
 * Run this script to generate sitemap.xml in the public folder.
 * 
 * Usage:
 * 1. Update the routes array with your application's pages
 * 2. Run: node --loader tsx src/utils/generateSitemap.ts
 * 3. Or integrate into your build process
 */

interface SitemapRoute {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

const SITE_URL = 'https://zymios.lovable.app';

// Define your application routes
const routes: SitemapRoute[] = [
  {
    path: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/academy',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: 0.6,
  },
  // Add individual course pages dynamically
  // Example:
  // {
  //   path: '/courses/1',
  //   changefreq: 'weekly',
  //   priority: 0.8,
  // },
];

export const generateSitemap = (): string => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes
      .map(
        (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
      )
      .join('\n')}
</urlset>`;

  return sitemap;
};

// Generate sitemap with dynamic course data
export const generateDynamicSitemap = async (courses?: Array<{ id: string; updatedAt?: string }>): Promise<string> => {
  // Add dynamic course routes if courses are provided
  const dynamicRoutes: SitemapRoute[] = courses
    ? courses.map(course => ({
      path: `/academy/${course.id}`,
      changefreq: 'weekly' as const,
      priority: 0.8,
      lastmod: course.updatedAt || new Date().toISOString().split('T')[0],
    }))
    : [];

  const allRoutes = [...routes, ...dynamicRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
      .map(
        (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
      )
      .join('\n')}
</urlset>`;

  return sitemap;
};

// Example: Save sitemap to public folder (Node.js environment)
export const saveSitemap = async () => {
  if (typeof window !== 'undefined') {
    console.warn('Sitemap generation should run in a Node.js environment');
    return;
  }

  const fs = await import('fs');
  const path = await import('path');

  const sitemap = generateSitemap();
  const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');

  fs.writeFileSync(publicPath, sitemap, 'utf-8');
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
};

export default generateSitemap;
