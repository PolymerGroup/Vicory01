/**
 * build-data.mjs
 * ------------------------------------------------------------------
 * 把治理层产出的 master_peptides.json（119 个可上站产品）
 * 转换成站点消费的 src/data/peptides.json。
 *
 * 用法：
 *   node scripts/build-data.mjs
 *   MASTER_DB=../master_db/master_peptides.json node scripts/build-data.mjs
 *
 * 设计要点：
 *  - 只取 publishable=true 的 119 个产品，drafts 一律不进站；
 *  - 报价统一为 USD / Kit(10 vials)，阶梯价直接用 master 里的 tiers；
 *  - CAS / 序列 / 分子量在源表缺失时为 null，站点显示 “Available on batch COA”，
 *    绝不编造化学参数；
 *  - COA 面板为 “illustrative specimen”，仅展示规格限值，不伪造实测值。
 * ------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MASTER =
  process.env.MASTER_DB ||
  resolve(ROOT, '..', 'master_db', 'master_peptides.json');

const OUT_FILE = resolve(ROOT, 'src/data/peptides.json');

// CI / Cloudflare Pages 上不存在治理层主库（它在本地 ../master_db/）：
// 只要 src/data/peptides.json 已经提交，就直接跳过，用已提交的数据构建。
if (!existsSync(MASTER)) {
  if (existsSync(OUT_FILE)) {
    console.log(
      `[build-data] master DB not found at ${MASTER} — using committed src/data/peptides.json (skip regenerate).`
    );
    process.exit(0);
  }
  console.error(
    `[build-data] 找不到 master 数据库 (${MASTER})，仓库里也没有 src/data/peptides.json。\n` +
      `请先在有主库的机器上运行 pnpm run data，或设置环境变量 MASTER_DB 指向主库路径。`
  );
  process.exit(1);
}

const master = JSON.parse(readFileSync(MASTER, 'utf8'));

/* ------------------------------------------------------------------ */
/* 分类元数据（与 master taxonomy 的 site_buckets 一一对应）           */
/* ------------------------------------------------------------------ */
const CATEGORY_META = {
  glp1_metabolic: {
    label: 'Metabolic & Weight-Management Peptides',
    short: 'Metabolic',
    blurb:
      'GLP-1 / GIP / amylin receptor research peptides, supplied as lyophilized powder in 10-vial kits.',
    accent: 'brand',
    icon: 'flask',
  },
  repair_recovery: {
    label: 'Repair & Recovery Peptides',
    short: 'Repair',
    blurb:
      'Regenerative research peptides including BPC-157, TB-500 and KPV, batch-tested by RP-HPLC.',
    accent: 'ocean',
    icon: 'shield',
  },
  cosmetic_antiaging: {
    label: 'Cosmetic & Dermal Peptides',
    short: 'Cosmetic',
    blurb:
      'Copper peptides and signal peptides for cosmetic raw-material and in-vitro dermal research.',
    accent: 'brand',
    icon: 'sparkles',
  },
  gh_secretagogue: {
    label: 'Growth Hormone Secretagogues',
    short: 'GH Secretagogues',
    blurb:
      'GHRH analogues and ghrelin-receptor secretagogues for endocrine research use only.',
    accent: 'ocean',
    icon: 'activity',
  },
  bioregulator: {
    label: 'Bioregulators & Longevity Peptides',
    short: 'Bioregulators',
    blurb:
      'Short bioregulatory peptides, neuropeptides and mitochondrial-derived peptides.',
    accent: 'ocean',
    icon: 'dna',
  },
  blend: {
    label: 'Multi-Component Blends',
    short: 'Blends',
    blurb:
      'Pre-formulated multi-peptide blends with a fixed per-vial composition.',
    accent: 'brand',
    icon: 'layers',
  },
  solvent_ancillary: {
    label: 'Solvents & Ancillary Reagents',
    short: 'Ancillary',
    blurb:
      'Bacteriostatic water, dilute acetic acid, benzyl alcohol and non-peptide ancillary reagents.',
    accent: 'slate',
    icon: 'droplet',
  },
};

const ORDER = [
  'glp1_metabolic',
  'repair_recovery',
  'cosmetic_antiaging',
  'gh_secretagogue',
  'bioregulator',
  'blend',
  'solvent_ancillary',
];

/* ------------------------------------------------------------------ */
/* 工具                                                               */
/* ------------------------------------------------------------------ */
const nf = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function fmtMoney(v) {
  return v == null ? null : Number(nf.format(v).replace(/,/g, ''));
}

function specLabel(sku) {
  const unit = sku.unit || '';
  const s = sku.strength;
  const num = s == null ? '' : Number.isInteger(s) ? String(s) : String(s);
  if (sku.components && sku.components.length) {
    return `${num}(${sku.components.map((c) => (Number.isInteger(c) ? c : c)).join('+')}) ${unit}`;
  }
  if (unit === 'ml') return `${num} mL`;
  if (unit === 'iu') return `${num} IU`;
  if (unit === 'mcg') return `${num} mcg`;
  return `${num} ${unit}`;
}

function coaFor(p) {
  const code = p.short_code || p.slug.toUpperCase().slice(0, 4);
  const isLiquid = p.form === 'sterile_solution';
  return {
    isSpecimen: true,
    lotFormat: `VC-2026-${code}-01`,
    lotExample: `VC-2026-${code}-0X`,
    method: isLiquid ? 'Appearance / pH / Sterility (membrane filtration)' : 'RP-HPLC (purity) · ESI-MS (identity)',
    appearance: p.appearance,
    puritySpec: p.purity || 'Not applicable (ancillary reagent)',
    moistureSpec: isLiquid ? 'n/a' : '≤ 5.0 % (Karl Fischer)',
    endotoxinSpec: '≤ 5 EU/mg (LAL, where applicable)',
    storage: p.storage?.lyophilized || p.storage?.solution || 'Store at -20 °C, protected from light',
    chromatogram: !isLiquid,
    disclaimer:
      'Illustrative specimen only. The official lot-specific COA with measured values is issued per batch and available by email.',
  };
}

/* ------------------------------------------------------------------ */
/* 转换                                                               */
/* ------------------------------------------------------------------ */
const products = master.products
  .filter((p) => p.publishable !== false)
  .map((p) => {
    const specs = (p.skus || []).map((s) => {
      const tiers = (s.tiers || []).map((t) => ({
        min: t.min_qty,
        max: t.max_qty,
        price: fmtMoney(t.unit_price_usd),
        label:
          t.max_qty == null ? `${t.min_qty}+ Kits` : `${t.min_qty}–${t.max_qty} Kits`,
      }));
      return {
        spec: s.spec,
        label: specLabel(s),
        strength: s.strength,
        unit: s.unit,
        vials: s.vials || 10,
        perKit: fmtMoney(s.price?.per_kit_usd),
        perVial: fmtMoney(s.price?.per_vial_usd),
        tiers,
        tierFrom: tiers.length ? tiers[0].price : fmtMoney(s.price?.per_kit_usd),
      };
    });

    const tierPrices = specs.flatMap((s) => s.tiers.map((t) => t.price)).filter((v) => v != null);
    const priceFrom = tierPrices.length ? Math.min(...tierPrices) : null;
    const priceTo = specs.map((s) => s.perKit).filter((v) => v != null);
    const priceToMax = priceTo.length ? Math.max(...priceTo) : null;

    const cat = CATEGORY_META[p.category_primary] || CATEGORY_META.bioregulator;

    return {
      id: p.id,
      slug: p.slug,
      name: p.standard_name,
      shortCode: p.short_code,
      aliases: p.alternate_names || [],
      searchTerms: [
        p.standard_name,
        p.short_code,
        ...(p.alternate_names || []),
        ...(p.search_terms || []),
        p.cas || '',
        cat.short,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
      category: p.category_primary,
      categoryLabel: cat.label,
      categoryShort: cat.short,
      tags: p.tags || [],
      sequenceType: p.sequence_type,
      moleculeClass: p.molecule_class,
      form: p.form,
      appearance: p.appearance,
      purity: p.purity,
      purityVerified: !!p.purity_verified,
      storage: {
        lyophilized: p.storage?.lyophilized || null,
        solution: p.storage?.solution || null,
        reconstituted: p.storage?.reconstituted || null,
        summary:
          p.storage?.lyophilized ||
          p.storage?.solution ||
          'Store at -20 °C, protected from light and moisture',
      },
      cas: p.cas || null,
      sequence: p.sequence || null,
      formula: p.molecular_formula || null,
      molecularWeight: p.molecular_weight || null,
      chemistryStatus: p.cas ? 'documented' : 'pending-coa',
      composition: p.composition || [],
      kitVials: specs[0]?.vials || 10,
      specs,
      priceFrom,
      priceTo: priceToMax,
      currency: 'USD',
      priceUnit: 'Kit (10 vials)',
      moqKits: p.commerce?.moq_kits || 1,
      geoSummary: p.geo_fact_summary,
      faqs: (p.faq_pairs || []).map((f) => ({ q: f.question, a: f.answer })),
      coa: coaFor(p),
      imageUrl: null,
      coaPdfUrl: null,
    };
  });

/* 校验 */
const slugs = new Set();
for (const p of products) {
  if (slugs.has(p.slug)) throw new Error(`slug 重复: ${p.slug}`);
  slugs.add(p.slug);
  if (!p.specs.length) throw new Error(`无规格: ${p.slug}`);
}

const counts = ORDER.map((k) => ({
  key: k,
  ...CATEGORY_META[k],
  count: products.filter((p) => p.category === k).length,
})).filter((c) => c.count > 0);

const out = {
  generatedAt: new Date().toISOString(),
  sourceVersion: master.schema?.version || 'unknown',
  currency: 'USD',
  priceUnit: 'Kit (10 vials)',
  productCount: products.length,
  categories: counts,
  products: products.sort((a, b) => a.name.localeCompare(b.name)),
};

mkdirSync(resolve(ROOT, 'src/data'), { recursive: true });
writeFileSync(resolve(ROOT, 'src/data/peptides.json'), JSON.stringify(out, null, 2), 'utf8');

console.log(
  `[build-data] ${products.length} products · ${counts.reduce((n, c) => n + c.count, 0)} categorised · ` +
    `${products.reduce((n, p) => n + p.specs.length, 0)} SKUs → src/data/peptides.json`
);
for (const c of counts) console.log(`  ${String(c.count).padStart(3)}  ${c.key.padEnd(20)} ${c.label}`);
