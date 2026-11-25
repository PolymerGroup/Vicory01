import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import data from '../data/peptides.json';

const SITE = 'https://dchemi.com';

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const products = (data.products as any[]) || [];
  const posts = await getCollection('peppedia');

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/products', priority: '0.95', changefreq: 'weekly' },
    { loc: '/peppedia', priority: '0.85', changefreq: 'weekly' },
    { loc: '/quality-coa', priority: '0.7', changefreq: 'monthly' },
    { loc: '/about-compliance', priority: '0.6', changefreq: 'monthly' },
    { loc: '/rfq', priority: '0.8', changefreq: 'monthly' },
  ];

  const urls = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...products.map(
      (p) => `  <url>
    <loc>${SITE}/peptides/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
    ),
    ...posts.map(
      (post) => `  <url>
    <loc>${SITE}/peppedia/${post.id}</loc>
    <lastmod>${(post.data.updatedAt ?? post.data.publishedAt).toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
