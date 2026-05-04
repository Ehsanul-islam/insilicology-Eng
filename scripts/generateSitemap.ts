/**
 * Dynamic Sitemap Generator
 * 
 * Generates sitemap.xml with all dynamic content from the database
 * Usage: Add to package.json scripts: "sitemap": "tsx scripts/generateSitemap.ts"
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://insilicology.com';

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials in environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SitemapRoute {
    path: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
    lastmod?: string;
}

// Static routes
const staticRoutes: SitemapRoute[] = [
    {
        path: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0],
    },
    {
        path: '/courses',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0],
    },
    {
        path: '/portfolio',
        changefreq: 'weekly',
        priority: 0.8,
    },
    {
        path: '/blog',
        changefreq: 'daily',
        priority: 0.8,
    },
    {
        path: '/contact',
        changefreq: 'monthly',
        priority: 0.7,
    },
    {
        path: '/career',
        changefreq: 'monthly',
        priority: 0.6,
    },
    {
        path: '/privacy',
        changefreq: 'yearly',
        priority: 0.3,
    },
    {
        path: '/terms',
        changefreq: 'yearly',
        priority: 0.3,
    },
];

async function fetchDynamicRoutes(): Promise<SitemapRoute[]> {
    const routes: SitemapRoute[] = [];

    try {
        // Fetch published courses
        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('slug, updated_at')
            .eq('status', 'published')
            .order('updated_at', { ascending: false });

        if (coursesError) {
            console.warn('⚠️  Error fetching courses:', coursesError.message);
        } else if (courses) {
            courses.forEach(course => {
                routes.push({
                    path: `/courses/${course.slug}`,
                    changefreq: 'weekly',
                    priority: 0.8,
                    lastmod: course.updated_at ? new Date(course.updated_at).toISOString().split('T')[0] : undefined,
                });
            });
            console.log(`✅ Fetched ${courses.length} courses`);
        }

        // Fetch published blog posts
        const { data: blogPosts, error: blogError } = await supabase
            .from('blog_posts')
            .select('slug, updated_at')
            .eq('status', 'published')
            .order('updated_at', { ascending: false });

        if (blogError) {
            console.warn('⚠️  Error fetching blog posts:', blogError.message);
        } else if (blogPosts) {
            blogPosts.forEach(post => {
                routes.push({
                    path: `/blog/${post.slug}`,
                    changefreq: 'monthly',
                    priority: 0.7,
                    lastmod: post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : undefined,
                });
            });
            console.log(`✅ Fetched ${blogPosts.length} blog posts`);
        }

        // Fetch published portfolio items
        const { data: portfolioItems, error: portfolioError } = await supabase
            .from('portfolio')
            .select('slug, updated_at')
            .eq('status', 'published')
            .order('updated_at', { ascending: false });

        if (portfolioError) {
            console.warn('⚠️  Error fetching portfolio items:', portfolioError.message);
        } else if (portfolioItems) {
            portfolioItems.forEach(item => {
                routes.push({
                    path: `/portfolio/${item.slug}`,
                    changefreq: 'monthly',
                    priority: 0.7,
                    lastmod: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : undefined,
                });
            });
            console.log(`✅ Fetched ${portfolioItems.length} portfolio items`);
        }
    } catch (error) {
        console.error('❌ Error fetching dynamic routes:', error);
    }

    return routes;
}

function generateSitemapXML(routes: SitemapRoute[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
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

    return xml;
}

async function main() {
    console.log('🌐 Generating dynamic sitemap...\n');

    // Fetch dynamic routes
    const dynamicRoutes = await fetchDynamicRoutes();

    // Combine static and dynamic routes
    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    // Generate XML
    const sitemapXML = generateSitemapXML(allRoutes);

    // Write to public folder
    const publicPath = join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(publicPath, sitemapXML, 'utf-8');

    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`📍 Location: ${publicPath}`);
    console.log(`📊 Total URLs: ${allRoutes.length}`);
    console.log(`   - Static pages: ${staticRoutes.length}`);
    console.log(`   - Dynamic pages: ${dynamicRoutes.length}`);
}

main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
