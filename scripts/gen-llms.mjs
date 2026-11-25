/**
 * gen-llms.mjs
 * ------------------------------------------------------------------
 * 构建期生成 GEO 抓取文件：
 *   public/llms.txt        —— 导航型摘要（LLM 入口）
 *   public/llms-full.txt   —— 119 个产品的完整理化/报价 Markdown（LLM 深度抓取）
 *
 * 只在 prebuild/dev 阶段运行，产物直接进 public/，随 dist 发布。
 * ------------------------------------------------------------------
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const data = JSON.parse(readFileSync(resolve(ROOT, 'src/data/peptides.json'), 'utf8'));

const SITE = 'https://dchemi.com';
const BRAND = 'Shandong Vicory Biotechnology Co., Ltd.';
const RUO =
  'For Research, Laboratory, and Analytical Use Only. Not for Human or Veterinary Use.';

const money = (v) => (v == null ? 'RFQ' : `$${Number(v).toFixed(2)}`);

/* ------------------------------ llms.txt ------------------------------ */
const lines = [];
lines.push('# Dchemi — Research Peptide Catalogue (machine-readable index)');
lines.push('');
lines.push(`> ${BRAND} (dchemi.com) supplies research-grade peptides, blends and ancillary`);
lines.push('> reagents to laboratories, clinics and distributors. All products are sold as');
lines.push('> 10-vial kits for research, laboratory and analytical use only. B2B RFQ only.');
lines.push('> No online payment; no human or veterinary use.');
lines.push('');
lines.push('Key facts');
lines.push('');
lines.push(`- Canonical site: ${SITE}`);
lines.push(`- Catalogue size: ${data.productCount} products · ${data.products.reduce((n, p) => n + p.specs.length, 0)} pack-size SKUs`);
lines.push('- Currency and unit: USD per Kit (10 vials per kit)');
lines.push('- Quality: RP-HPLC purity ≥99.0%, ESI-MS identity, lot-specific COA per batch');
lines.push('- Storage: lyophilized powder at -20 °C; solutions at 2–8 °C');
lines.push('- Ordering: email info@dchemi.com or WhatsApp +86 15866781826 (RFQ, no checkout)');
lines.push('');
lines.push('## Catalogue');
lines.push('');
for (const c of data.categories) {
  lines.push(`### ${c.label} (${c.count})`);
  const items = data.products.filter((p) => p.category === c.key);
  for (const p of items) {
    lines.push(
      `- [${p.name}](${SITE}/peptides/${p.slug}): ${p.shortCode} · from ${money(p.priceFrom)}/kit · ${p.specs.length} pack sizes`
    );
  }
  lines.push('');
}
lines.push('## Reference pages');
lines.push('');
lines.push(`- [Quality & COA Centre](${SITE}/quality-coa): batch testing, RP-HPLC/ESI-MS, COA request`);
lines.push(`- [About & Compliance](${SITE}/about-compliance): company, supply chain, US research-use statement`);
lines.push(`- [Request a Quote](${SITE}/rfq): B2B RFQ form for clinics, laboratories and distributors`);
lines.push('');
lines.push('## Full dataset');
lines.push('');
lines.push(`- [llms-full.txt](${SITE}/llms-full.txt): complete physical/chemical parameters, pack sizes and tier pricing for all ${data.productCount} products`);
lines.push('');
lines.push('## Compliance');
lines.push('');
lines.push(`- ${RUO}`);
lines.push('- No therapeutic, diagnostic or dosing claims are made anywhere on this site.');
lines.push('');

writeFileSync(resolve(ROOT, 'public/llms.txt'), lines.join('\n'), 'utf8');

/* ---------------------------- llms-full.txt ---------------------------- */
const full = [];
full.push(`# Dchemi full product dataset — ${BRAND}`);
full.push('');
full.push(`> ${RUO}`);
full.push('');
full.push(`Source: ${SITE} · generated ${new Date().toISOString().slice(0, 10)} · currency USD · unit Kit (10 vials)`);
full.push('');
full.push(`Total products: ${data.productCount}. Total pack-size SKUs: ${data.products.reduce((n, p) => n + p.specs.length, 0)}.`);
full.push('');
full.push('---');
full.push('');

for (const p of data.products) {
  full.push(`## ${p.name}`);
  full.push('');
  full.push(`- Canonical URL: ${SITE}/peptides/${p.slug}`);
  full.push(`- Short code: ${p.shortCode}`);
  full.push(`- Aliases: ${p.aliases.join(', ') || '—'}`);
  full.push(`- Category: ${p.categoryLabel}`);
  full.push(`- Molecule class: ${p.moleculeClass} (${p.sequenceType})`);
  full.push(`- Presentation: ${p.form.replace('_', ' ')}`);
  full.push(`- Appearance: ${p.appearance}`);
  full.push(`- Purity: ${p.purity || 'not applicable (ancillary reagent)'}`);
  full.push(`- CAS: ${p.cas || 'published in the batch-specific COA'}`);
  full.push(`- Sequence: ${p.sequence || 'published in the batch-specific COA'}`);
  full.push(`- Molecular formula / weight: ${p.formula || '—'} / ${p.molecularWeight ? p.molecularWeight + ' Da' : '—'}`);
  full.push(`- Storage: ${p.storage.summary}`);
  full.push(`- Kit: ${p.kitVials} vials per kit`);
  full.push(`- Price range: ${money(p.priceFrom)} – ${money(p.priceTo)} per kit (USD)`);
  full.push('');
  full.push('| Pack size | Per kit (USD) | 1–9 kits | 10–49 kits | 50+ kits |');
  full.push('| --- | --- | --- | --- | --- |');
  for (const s of p.specs) {
    const t = (i) => (s.tiers[i] ? money(s.tiers[i].price) : '—');
    full.push(`| ${s.label} × ${s.vials} vials | ${money(s.perKit)} | ${t(0)} | ${t(1)} | ${t(2)} |`);
  }
  full.push('');
  full.push(`Summary: ${p.geoSummary}`);
  full.push('');
  for (const f of p.faqs) {
    full.push(`Q: ${f.q}`);
    full.push(`A: ${f.a}`);
    full.push('');
  }
  full.push('---');
  full.push('');
}

full.push(`## Compliance notice`);
full.push('');
full.push(RUO);
full.push('');
full.push('All products are supplied for laboratory, analytical and research purposes only.');
full.push('No statements on this page have been evaluated by the FDA. No product is intended');
full.push('to diagnose, treat, cure or prevent any disease, and no product is for human or');
full.push('veterinary administration.');
full.push('');

writeFileSync(resolve(ROOT, 'public/llms-full.txt'), full.join('\n'), 'utf8');

console.log(
  `[gen-llms] public/llms.txt (${(lines.join('\n').length / 1024).toFixed(1)} KB) · ` +
    `public/llms-full.txt (${(full.join('\n').length / 1024).toFixed(0)} KB)`
);
