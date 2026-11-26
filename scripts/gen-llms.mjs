/**
 * gen-llms.mjs
 * ------------------------------------------------------------------
 * 构建期生成 GEO 抓取资产：
 *   public/llms.txt                 —— 索引（小而快，先读这个）
 *   public/llms/{category}.txt      —— 7 个分类的完整数据（每个 ~30–60 KB）
 *   public/peptides/{slug}.json     —— 单个产品的结构化 JSON（可增量抓取）
 *   public/llms-full.txt            —— 全量单文件（向后兼容，体积较大）
 *
 * 设计目的：避免让模型一次吞 260 KB；索引 → 分类 → 单品三级粒度。
 * ------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const data = JSON.parse(readFileSync(resolve(ROOT, 'src/data/peptides.json'), 'utf8'));

const TODAY = new Date().toISOString().slice(0, 10);
const SITE = 'https://dchemi.com';
const BRAND = 'Shandong Vicory Biotechnology Co., Ltd.';
const RUO =
  'For Research, Laboratory, and Analytical Use Only. Not for Human or Veterinary Use.';
const money = (v) => (v == null ? 'RFQ' : `$${Number(v).toFixed(2)}`);

/* 分类 → 文件名（与将来 /peptides/{slug} 分类落地页保持同一套 slug） */
const CAT_SLUG = {
  glp1_metabolic: 'glp1-metabolic',
  repair_recovery: 'repair-recovery',
  cosmetic_antiaging: 'cosmetic-antiaging',
  gh_secretagogue: 'gh-secretagogues',
  bioregulator: 'bioregulators',
  blend: 'blends',
  solvent_ancillary: 'ancillary',
};

/* ---------------- PepPedia 文章元数据 ---------------- */
const PEPPEDIA_DIR = resolve(ROOT, 'src/content/peppedia');

function readPeppedia() {
  if (!existsSync(PEPPEDIA_DIR)) return [];
  return readdirSync(PEPPEDIA_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((file) => {
      const raw = readFileSync(join(PEPPEDIA_DIR, file), 'utf8');
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const meta = {};
      if (fm) {
        for (const line of fm[1].split(/\r?\n/)) {
          const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
          if (!m) continue;
          meta[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
        }
      }
      return {
        slug: file.replace(/\.mdx?$/, ''),
        title: meta.title || file.replace(/\.mdx?$/, ''),
        description: meta.description || '',
        publishedAt: meta.publishedAt || '',
      };
    })
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

const peppedia = readPeppedia();

/* ---------------- 单个产品的详细 Markdown 块 ---------------- */
function productBlock(p) {
  const out = [];
  const blend = p.sequenceType === 'blend' || p.category === 'blend';
  const coaNote = blend
    ? 'fixed composition, listed in the batch-specific COA'
    : 'published in the batch-specific COA';
  const formula = p.molecularFormula || p.formula || null;
  const mw = p.molecularWeight
    ? /da$/i.test(String(p.molecularWeight))
      ? p.molecularWeight
      : `${p.molecularWeight} Da`
    : null;

  out.push(`## ${p.name}`);
  out.push('');
  out.push(`- Canonical URL: ${SITE}/peptides/${p.slug}`);
  out.push(`- Machine-readable JSON: ${SITE}/peptides/${p.slug}.json`);
  out.push(`- Short code: ${p.shortCode}`);
  out.push(`- Aliases: ${p.aliases.join(', ') || '—'}`);
  out.push(`- Category: ${p.categoryLabel}`);
  out.push(`- Molecule class: ${p.moleculeClass} (${p.sequenceType})`);
  out.push(`- Appearance: ${p.appearance}`);
  out.push(`- Purity: ${p.purity || 'not applicable (ancillary reagent)'}`);
  out.push(`- CAS: ${p.cas || coaNote}`);
  if (p.sequence) out.push(`- Sequence: ${p.sequence}`);
  out.push(`- Molecular formula: ${formula || coaNote}`);
  out.push(`- Molecular weight: ${mw || coaNote}`);
  out.push(`- Storage: ${p.storage.summary}`);
  out.push(`- Pack size: ${p.kitVials} vials per kit`);
  out.push(`- Price unit: USD per kit of ${p.kitVials} vials`);
  out.push(`- Price range: ${money(p.priceFrom)} – ${money(p.priceTo)} per kit (USD)`);
  out.push(`- Last reviewed: ${TODAY}`);
  out.push('');
  out.push('| Pack size | Per kit (USD) | 1–9 kits | 10–49 kits | 50+ kits |');
  out.push('| --- | --- | --- | --- | --- |');
  for (const s of p.specs) {
    const t = (i) => (s.tiers[i] ? money(s.tiers[i].price) : '—');
    out.push(`| ${s.label} × ${s.vials} vials | ${money(s.perKit)} | ${t(0)} | ${t(1)} | ${t(2)} |`);
  }
  out.push('');
  out.push(`Summary: ${p.geoSummary}`);
  out.push('');
  for (const f of p.faqs) {
    out.push(`Q: ${f.q}`);
    out.push(`A: ${f.a}`);
    out.push('');
  }
  out.push('---');
  out.push('');
  return out;
}

/* ---------------- 单个产品的 JSON ---------------- */
function productJson(p) {
  const formula = p.molecularFormula || p.formula || null;
  return {
    schema: 'dchemi.product/1',
    url: `${SITE}/peptides/${p.slug}`,
    lastReviewed: TODAY,
    name: p.name,
    slug: p.slug,
    shortCode: p.shortCode,
    aliases: p.aliases,
    category: { key: p.category, label: p.categoryLabel },
    chemistry: {
      cas: p.cas || null,
      sequence: p.sequence || null,
      molecularFormula: formula,
      molecularWeight: p.molecularWeight || null,
      purity: p.purity || null,
      appearance: p.appearance,
      form: p.form,
      moleculeClass: p.moleculeClass,
      sequenceType: p.sequenceType,
    },
    packSizes: p.specs.map((s) => ({
      spec: s.spec,
      label: s.label,
      vials: s.vials,
      perKit: s.perKit,
      perVial: s.perVial,
      tiers: s.tiers.map((t) => ({ label: t.label, price: t.price })),
    })),
    pricing: {
      currency: 'USD',
      unit: `per kit of ${p.kitVials} vials`,
      from: p.priceFrom,
      to: p.priceTo,
      moqKits: p.moqKits,
    },
    storage: p.storage.summary,
    definition: p.geoSummary,
    faq: p.faqs.map((f) => ({ question: f.q, answer: f.a })),
    compliance: RUO,
  };
}

/* ---------------- 写入 7 个分类文件 ---------------- */
const llmsDir = resolve(ROOT, 'public/llms');
mkdirSync(llmsDir, { recursive: true });
const jsonDir = resolve(ROOT, 'public/peptides');
mkdirSync(jsonDir, { recursive: true });

const catStats = [];
for (const c of data.categories) {
  const fileSlug = CAT_SLUG[c.key] || c.key;
  const items = data.products.filter((p) => p.category === c.key);
  const body = [];
  body.push(`# ${c.label} — Dchemi research peptide dataset`);
  body.push('');
  body.push(`> ${RUO}`);
  body.push('');
  body.push(`Source: ${SITE} · generated ${TODAY} · currency USD · unit Kit (10 vials)`);
  body.push(`Products in this category: ${items.length}`);
  body.push(`Index: ${SITE}/llms.txt · Full dataset: ${SITE}/llms-full.txt`);
  body.push('');
  body.push('---');
  body.push('');
  for (const p of items) body.push(...productBlock(p));
  const text = body.join('\n');
  writeFileSync(resolve(llmsDir, `${fileSlug}.txt`), text, 'utf8');
  catStats.push({ key: c.key, slug: fileSlug, label: c.label, count: items.length, kb: text.length / 1024 });
}

/* ---------------- 写入 119 个产品 JSON ---------------- */
for (const p of data.products) {
  writeFileSync(resolve(jsonDir, `${p.slug}.json`), JSON.stringify(productJson(p), null, 2), 'utf8');
}

/* ---------------- llms.txt：只做索引 ---------------- */
const idx = [];
idx.push('# Dchemi — Research Peptide Catalogue (LLM index)');
idx.push('');
idx.push(`> ${BRAND} (dchemi.com) supplies research-grade peptides, blends and ancillary`);
idx.push('> reagents to laboratories, clinics and distributors. All products are sold as');
idx.push('> 10-vial kits for research, laboratory and analytical use only. B2B RFQ only.');
idx.push('> No online payment; no human or veterinary use.');
idx.push('');
idx.push('## Start here');
idx.push('');
idx.push(`- [Full dataset (single file, ~260 KB)](${SITE}/llms-full.txt): every product, all parameters and tiers`);
idx.push(`- [Product JSON]( ${SITE}/peptides/{slug}.json ): one file per product, schema \`dchemi.product/1\``);
idx.push(`- [Comparisons](${SITE}/compare): side-by-side analytical comparisons (X vs Y)`);
idx.push('');
idx.push('## Key facts');
idx.push('');
idx.push(`- Canonical site: ${SITE}`);
idx.push(`- Catalogue size: ${data.productCount} products · ${data.products.reduce((n, p) => n + p.specs.length, 0)} pack-size SKUs`);
idx.push('- Currency and unit: USD per kit (10 vials per kit)');
idx.push('- Quality: RP-HPLC purity ≥99.0%, ESI-MS identity, lot-specific COA per batch');
idx.push('- Storage: lyophilized powder at -20 °C; solutions at 2–8 °C');
idx.push('- Ordering: email info@dchemi.com or WhatsApp +86 15866781826 (RFQ, no checkout)');
idx.push(`- Generated: ${TODAY} · every dataset page carries its own \`Last reviewed\` date`);
idx.push('');
idx.push('## Category datasets');
idx.push('');
for (const c of catStats) {
  idx.push(
    `- [${c.label}](${SITE}/llms/${c.slug}.txt): ${c.count} products, ${c.kb.toFixed(0)} KB — ${data.categories.find((x) => x.key === c.key)?.blurb || ''}`
  );
  idx.push(`  Human page: ${SITE}/peptides/${c.slug}`);
}
idx.push('');
idx.push('## Catalogue (name · short code · starting price)');
idx.push('');
for (const c of data.categories) {
  idx.push(`### ${c.label} (${c.count})`);
  for (const p of data.products.filter((x) => x.category === c.key)) {
    idx.push(
      `- [${p.name}](${SITE}/peptides/${p.slug}): ${p.shortCode} · from ${money(p.priceFrom)}/kit · ${p.specs.length} pack sizes`
    );
  }
  idx.push('');
}
idx.push('## PepPedia — research notes & analytics');
idx.push('');
if (peppedia.length) {
  for (const a of peppedia) idx.push(`- [${a.title}](${SITE}/peppedia/${a.slug}): ${a.description}`);
} else {
  idx.push('- (no articles yet)');
}
idx.push('');
idx.push('## Reference pages');
idx.push('');
idx.push(`- [PepPedia library](${SITE}/peppedia): analytical, handling and sourcing articles`);
idx.push(`- [Quality & COA Centre](${SITE}/quality-coa): batch testing, RP-HPLC/ESI-MS, COA request`);
idx.push(`- [About & Compliance](${SITE}/about-compliance): company, supply chain, US research-use statement`);
idx.push(`- [Request a Quote](${SITE}/rfq): B2B RFQ form for clinics, laboratories and distributors`);
idx.push('');
idx.push('## Compliance');
idx.push('');
idx.push(`- ${RUO}`);
idx.push('- No therapeutic, diagnostic or dosing claims are made anywhere on this site.');
idx.push('');

const indexPath = resolve(ROOT, 'public/llms.txt');
writeFileSync(indexPath, idx.join('\n'), 'utf8');

/* ---------------- llms-full.txt（向后兼容） ---------------- */
const full = [];
full.push(`# Dchemi full product dataset — ${BRAND}`);
full.push('');
full.push(`> ${RUO}`);
full.push('');
full.push(`Source: ${SITE} · generated ${TODAY} · currency USD · unit Kit (10 vials)`);
full.push('');
full.push(`Total products: ${data.productCount}. Total pack-size SKUs: ${data.products.reduce((n, p) => n + p.specs.length, 0)}.`);
full.push(`Prefer the split files for incremental retrieval: ${SITE}/llms.txt`);
full.push('');
full.push('---');
full.push('');
for (const p of data.products) full.push(...productBlock(p));
full.push(`## PepPedia — research notes`);
full.push('');
for (const a of peppedia) {
  full.push(`- ${a.title} — ${SITE}/peppedia/${a.slug}`);
  full.push(`  ${a.description}`);
}
full.push('');
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
  `[gen-llms] index ${(idx.join('\n').length / 1024).toFixed(1)} KB · ` +
    `full ${(full.join('\n').length / 1024).toFixed(0)} KB · ` +
    `${catStats.length} category files (${catStats.map((c) => `${c.slug} ${c.kb.toFixed(0)}KB`).join(', ')}) · ` +
    `${data.products.length} product JSON · ${peppedia.length} articles`
);
