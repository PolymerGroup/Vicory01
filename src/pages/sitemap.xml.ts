import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import data from '../data/peptides.json';
import { COMPARISONS } from '../lib/comparisons';
import { CATEGORY_PAGES } from '../lib/categories';

const SITE = 'https://dchemi.com';

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const products = (data.products as any[]) || [];

  // Product pages use the data timestamp as lastmod, not the build date,
  // otherwise every CI build claims all 119 products changed.
  const dataDate = String((data as any).generatedAt || '').slice(0, 10) || today;

  // Sort articles deterministically so repeated builds emit identical output
  const posts = (await getCollection('peppedia')).sort(
    (a, b) =>
      b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.id.localeCompare(b.id)
  );

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/products', priority: '0.95', changefreq: 'weekly' },
    { loc: '/peptides', priority: '0.85', changefreq: 'weekly' },
    ...CATEGORY_PAGES.map((c) => ({
      loc: `/peptides/${c.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
    })),
    { loc: '/compare', priority: '0.8', changefreq: 'monthly' },
    { loc: '/peppedia', priority: '0.85', changefreq: 'weekly' },
    { loc: '/quality-coa', priority: '0.7', changefreq: 'monthly' },
    { loc: '/about-compliance', priority: '0.6', changefreq: 'monthly' },
    { loc: '/rfq', priority: '0.8', changefreq: 'monthly' },
  ];

  const comparisons = COMPARISONS.map((c) => c.pair);

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
    <lastmod>${dataDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
    ),
    ...comparisons.map(
      (pair) => `  <url>
    <loc>${SITE}/compare/${pair}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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
