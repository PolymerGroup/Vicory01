import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import data from '../data/peptides.json';

const SITE = 'https://dchemi.com';

export const GET: APIRoute = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const products = (data.products as any[]) || [];

  // 数据生成日期：产品页 lastmod 用它而不是构建日期，
  // 否则每次 CI 重建都会告诉搜索引擎"119 个产品今天全改了"。
  const dataDate = String((data as any).generatedAt || '').slice(0, 10) || today;

  // 文章排序固定下来，保证多次构建输出完全一致（文件系统遍历顺序不稳定）
  const posts = (await getCollection('peppedia')).sort(
    (a, b) =>
      b.data.publishedAt.getTime() - a.data.publishedAt.getTime() || a.id.localeCompare(b.id)
  );

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
    <lastmod>${dataDate}</lastmod>
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
