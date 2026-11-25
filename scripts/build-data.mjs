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
/* 化学补录表：reference/chemistry_reference.csv                        */
/* 由 scripts/enrich-chemistry（PubChem 身份匹配 + 分子式/分子量合理性 +   */
/* CAS 校验和）生成，人工可审。仓库内提交，CI 构建同样读取。              */
/* ------------------------------------------------------------------ */
const CHEM_CSV = resolve(ROOT, 'reference', 'chemistry_reference.csv');

function readChemRef() {
  if (!existsSync(CHEM_CSV)) return {};
  const lines = readFileSync(CHEM_CSV, 'utf8').split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return {};
  const parse = (line) => (line.match(/"([^"]*)"/g) || []).map((c) => c.slice(1, -1));
  const header = parse(lines[0]);
  const out = {};
  for (const line of lines.slice(1)) {
    const cells = parse(line);
    const rec = {};
    header.forEach((h, i) => (rec[h] = cells[i] ?? ''));
    if (rec.slug) out[rec.slug] = rec;
  }
  return out;
}

const chemRef = readChemRef();

/** CAS 校验和（与治理层同一算法）：CSV 被手改也能挡住错值 */
function casChecksumOk(cas) {
  if (!/^\d{2,7}-\d{2}-\d$/.test(cas)) return false;
  const d = cas.replace(/-/g, '');
  let total = 0;
  [...d.slice(0, -1)].reverse().forEach((ch, i) => (total += Number(ch) * (i + 1)));
  return total % 10 === Number(d[d.length - 1]);
}

function cleanCas(cas) {
  const v = (cas || '').trim();
  return v && casChecksumOk(v) ? v : null;
}

/** CSV 里的 omit_fields（分号分隔）→ 模板按字段隐藏整行，例如 ace-031 不显示分子式 */
function chemOmit(slug) {
  const raw = (chemRef[slug]?.omit_fields || '').trim();
  return raw ? raw.split(';').map((s) => s.trim()).filter(Boolean) : [];
}

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
/**
 * 站点售价系数（markup）。
 * 治理层 master_peptides.json 里的是「成本/参考价」，站点对外报价 = 参考价 × 该系数。
 * 2026-11 调整：全站价格统一 ×2（例如 $40 → $80）。
 * 可用环境变量覆盖：PRICE_MULTIPLIER=1.5 pnpm run data
 */
const PRICE_MULTIPLIER = (() => {
  const raw = Number(process.env.PRICE_MULTIPLIER ?? 2);
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
})();

const nf = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function fmtMoney(v) {
  return v == null ? null : Number(nf.format(v).replace(/,/g, ''));
}

/** 应用售价系数，保留两位小数（$40.00 → $80.00） */
function sell(v) {
  if (v == null) return null;
  return Math.round(Number(v) * PRICE_MULTIPLIER * 100) / 100;
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
      // 先把参考价乘以售价系数，再参与所有派生计算，保证档位折扣与单价一致
      const perKit = sell(s.price?.per_kit_usd);
      const tiers = (s.tiers || []).map((t) => ({
        min: t.min_qty,
        max: t.max_qty,
        price: sell(t.unit_price_usd),
        label:
          t.max_qty == null ? `${t.min_qty}+ Kits` : `${t.min_qty}–${t.max_qty} Kits`,
      }));
      return {
        spec: s.spec,
        label: specLabel(s),
        strength: s.strength,
        unit: s.unit,
        vials: s.vials || 10,
        perKit,
        // 单价按「每箱价 ÷ 支数」重新推导，避免沿用治理层已四舍五入的旧值后误差被放大
        perVial:
          perKit == null ? null : Math.round((perKit / (s.vials || 10)) * 100) / 100,
        tiers,
        tierFrom: tiers.length ? tiers[0].price : perKit,
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
      // 化学参数：治理层优先，其次 PubChem 校验后的补录表，最后为空（页面回退 COA）
      cas: p.cas || cleanCas(chemRef[p.slug]?.cas) || null,
      sequence: p.sequence || (chemRef[p.slug]?.sequence || '').trim() || null,
      // 分子式同时输出两种键名：molecularFormula（schema.org 习惯）+ formula（旧键，向后兼容）
      molecularFormula:
        p.molecular_formula || (chemRef[p.slug]?.molecular_formula || '').trim() || null,
      formula: p.molecular_formula || (chemRef[p.slug]?.molecular_formula || '').trim() || null,
      molecularWeight:
        p.molecular_weight || (chemRef[p.slug]?.molecular_weight || '').trim() || null,
      chemistryStatus:
        p.cas || cleanCas(chemRef[p.slug]?.cas) || chemRef[p.slug]?.molecular_formula
          ? 'documented'
          : 'pending-coa',
      chemOmit: chemOmit(p.slug),
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
