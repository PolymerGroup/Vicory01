/**
 * build-data.mjs
 * ------------------------------------------------------------------
 * Turns the governance output (master_peptides.json, 119 publishable products)
 * into the site payload src/data/peptides.json.
 *
 * Usage:
 *   node scripts/build-data.mjs
 *   MASTER_DB=../master_db/master_peptides.json node scripts/build-data.mjs
 *
 * Design notes:
 *  - only publishable=true products are emitted; drafts never ship;
 *  - prices are USD per kit (10 vials) and reuse the master tier table;
 *  - CAS / sequence / molecular weight stay null when the source lacks them and the site shows a COA note,
 *    never inventing chemistry;
 *  - the COA panel is an illustrative specimen: limits only, no fabricated measurements.
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

// CI has no governance database (it lives locally in ../master_db/):
// as long as src/data/peptides.json is committed we skip regeneration and build from it.
if (!existsSync(MASTER)) {
  if (existsSync(OUT_FILE)) {
    console.log(
      `[build-data] master DB not found at ${MASTER} — using committed src/data/peptides.json (skip regenerate).`
    );
    process.exit(0);
  }
  console.error(
    `[build-data] master database not found at ${MASTER} and no committed src/data/peptides.json.\n` +
      `Run pnpm run data on a machine that has the database, or point MASTER_DB at it.`
  );
  process.exit(1);
}

const master = JSON.parse(readFileSync(MASTER, 'utf8'));

/* ------------------------------------------------------------------ */
/* Chemistry reference table: reference/chemistry_reference.csv          */
/* Built by the PubChem enrichment pass (identity match, formula/weight   */
/* sanity, CAS checksum), reviewed by hand and committed for CI builds.   */
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

/** CAS checksum (same algorithm as the governance layer) to catch bad hand edits */
function casChecksumOk(cas) {
  if (!/^\d{2,7}-\d{2}-\d$/.test(cas)) return false;
  const d = cas.replace(/-/g, '');
  let total = 0;
  [...d.slice(0, -1)].reverse().forEach((ch, i) => (total += Number(ch) * (i + 1)));
  return total % 10 === Number(d[d.length - 1]);
}

function cleanCas(cas) {
  const v = (cas || '').trim();
  // Annotated forms such as "100-51-6 (Benzyl alcohol)" are accepted: validate the core, render the full string
  const m = v.match(/^(\d{2,7}-\d{2}-\d)/);
  return m && casChecksumOk(m[1]) ? v : null;
}

/** omit_fields from the CSV (semicolon separated) hides whole rows, e.g. ace-031 has no formula row */
function chemOmit(slug) {
  const raw = (chemRef[slug]?.omit_fields || '').trim();
  return raw ? raw.split(';').map((s) => s.trim()).filter(Boolean) : [];
}

/* ------------------------------------------------------------------ */
/* Category metadata (mirrors the master taxonomy site_buckets)          */
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
/* Utilities                                                          */
/* ------------------------------------------------------------------ */
/**
 * Site price multiplier (markup).
 * The governance DB holds reference prices; the site sells at reference x multiplier.
 * 2026-11 adjustment: every price doubled ($40 -> $80).
 * Override with PRICE_MULTIPLIER=1.5 pnpm run data
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

/** Apply the multiplier and round to two decimals ($40.00 -> $80.00) */
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
/* Transform                                                          */
/* ------------------------------------------------------------------ */
const products = master.products
  .filter((p) => p.publishable !== false)
  .map((p) => {
    const specs = (p.skus || []).map((s) => {
      // Apply the multiplier first so tier discounts stay consistent with the unit price
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
        // Derive the per-vial price from the kit price instead of reusing the rounded governance value
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
      // Chemistry: governance value first, then the verified reference table, else null (page falls back to COA)
      cas: p.cas || cleanCas(chemRef[p.slug]?.cas) || null,
      sequence: p.sequence || (chemRef[p.slug]?.sequence || '').trim() || null,
      // Emit both formula keys: molecularFormula (schema.org) and the legacy formula key
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

/* ------------------------------------------------------------------ */
/* De-duplication: replace shared boilerplate with copy computed from each product.
 * Goal: lower pairwise 5-gram Jaccard on product pages (target <0.30)
 * while keeping every sentence factual rather than synonym swapping.
 * ------------------------------------------------------------------ */
const usd = (v) => (v == null ? 'quote' : `$${Number(v).toFixed(2)}`);
const pctOff = (base, v) => (base && v ? Math.round((1 - v / base) * 100) : 0);

function seedOf(s) {
  let h = 7;
  for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) % 1000003;
  return h;
}

function diversifyProduct(p) {
  const s0 = p.specs[0] || {};
  const tiers = s0.tiers || [];
  const list = s0.perKit;
  const t10 = tiers[1]?.price ?? null;
  const t50 = tiers[2]?.price ?? null;
  const sizes = p.specs.map((s) => s.label);
  const perVial = s0.perVial;
  const chem = [];
  if (p.cas) chem.push(`CAS ${p.cas}`);
  if (p.molecularFormula) chem.push(`formula ${p.molecularFormula}`);
  if (p.molecularWeight) chem.push(`${p.molecularWeight} Da`);
  const isLyo = p.form !== 'sterile_solution';

  /* ---- 1) page overview: three structures, each carrying this product's numbers ---- */
  const variants = [
    `${p.name} (${p.shortCode}) sits in the ${p.categoryLabel} group and ships as ${
      isLyo ? 'lyophilized powder' : 'sterile solution'
    } in ${p.kitVials}-vial kits. ${sizes.length} pack size${sizes.length > 1 ? 's are' : ' is'} listed (${sizes.join(
      ', '
    )}), with per-kit pricing from ${usd(p.priceFrom)} to ${usd(p.priceTo)} depending on the tier.`,
    `Catalogued under ${p.categoryLabel}, ${p.name} is a ${p.moleculeClass.replace(/_/g, ' ')} presented as ${
      isLyo ? 'a lyophilized powder' : 'a sterile solution'
    }. Each kit carries ${p.kitVials} vials; the ${sizes.length === 1 ? 'single pack size is' : 'pack sizes are'} ${sizes.join(
      ', '
    )}, and the 50+ kit tier settles at ${usd(t50 ?? p.priceFrom)} per kit.`,
    `${p.name} — short code ${p.shortCode} — is a ${p.moleculeClass.replace(/_/g, ' ')} in the ${
      p.categoryLabel
    } range, supplied as ${p.kitVials} vials per kit. The catalogue prices ${sizes.length} configuration${
      sizes.length > 1 ? 's' : ''
    } between ${usd(p.priceFrom)} and ${usd(p.priceTo)} per kit, with volume tiers applied at 10 and 50 kits.`,
  ];
  p.overview = variants[seedOf(p.slug) % variants.length];

  /* ---- 2) three catalogue notes that only this page can have ---- */
  const notes = [];
  if (list != null && perVial != null) {
    notes.push(
      `At the ${s0.label} pack size, ${usd(list)} per kit of ${p.kitVials} vials works out to ${usd(perVial)} per vial.`
    );
  }
  if (t10 != null && t50 != null && list) {
    notes.push(
      `Volume ladder: 10–49 kits at ${usd(t10)} (−${pctOff(list, t10)}%) and 50+ kits at ${usd(t50)} (−${pctOff(
        list,
        t50
      )}%); ${p.specs.length > 1 ? `the same ladder applies to each of the ${p.specs.length} pack sizes` : 'only one pack size is stocked'}.`
    );
  }
  notes.push(
    chem.length
      ? `Identity on file: ${chem.join(', ')}. Sequence-level confirmation, if held, is printed on the batch certificate of analysis.`
      : `${p.name} has no public CAS registration in this catalogue; the batch certificate of analysis is the authoritative identity document.`
  );
  p.catalogueNotes = notes;

  /* ---- 3) rewrite the two most repetitive FAQ answers ---- */
  const storeVariants = isLyo
    ? [
        `Hold the sealed ${p.kitVials}-vial kit at −20 °C, away from light and humidity. Once reconstituted, aliquot and keep at 2–8 °C; this ${p.shortCode} preparation does not tolerate repeated freeze–thaw.`,
        `Dry powder for ${p.name}: store at −20 °C. Working solution: 2–8 °C, used within the window printed on the ${p.shortCode} lot certificate.`,
        `${p.name} ships lyophilized and should stay at −20 °C until reconstitution; after that keep it at 2–8 °C and avoid freeze–thaw cycles.`,
      ]
    : [
        `Store the ${p.shortCode} solution at 2–8 °C, protected from light, and do not freeze. Handling notes for each lot are printed on the certificate of analysis.`,
        `${p.name} is supplied as a sterile solution: 2–8 °C, no freezing, and follow the ${p.shortCode} lot handling sheet for in-use limits.`,
        `Keep at 2–8 °C away from light. The ${p.shortCode} solution is not designed for freezing; in-use duration is stated per lot on the COA.`,
      ];
  const storeAnswer = storeVariants[seedOf(p.slug + 'storage') % storeVariants.length];

  const packAnswer =
    `${p.name} is stocked in ${sizes.length} pack size${sizes.length > 1 ? 's' : ''} (${sizes.join(', ')}), ` +
    `${p.kitVials} vials per kit, MOQ ${p.moqKits} kit. ` +
    (t10 != null && t50 != null
      ? `At 1–9 kits the per-kit price is ${usd(list)}; 10–49 kits falls to ${usd(t10)} (−${pctOff(
          list,
          t10
        )}%) and 50+ to ${usd(t50)} (−${pctOff(list, t50)}%).`
      : `Pricing is confirmed per quote.`);

  p.faqs = (p.faqs || []).map((f) => {
    const q = f.q.toLowerCase();
    if (q.includes('stored') || q.includes('storage')) return { ...f, a: storeAnswer };
    if (q.includes('pack size') || q.includes('available in')) return { ...f, a: packAnswer };
    if (q.includes('tested') || q.includes('purity and identity')) {
      const spec = p.purity || 'the release limit for this SKU';
      const identity = chem.length ? chem.join(', ') : 'no public CAS entry';
      const testVariants = [
        `Each ${p.shortCode} lot is run on RP-HPLC against a ${spec} release limit, then confirmed by MS. The batch certificate carries the measured purity, retention time and mass together with the identity string (${identity}).`,
        `Testing for ${p.name}: HPLC purity against ${spec}, MS confirmation of the intact mass, and a documented identity record (${identity}). Results are reported per lot, not as a catalogue average.`,
        `${p.name} is released lot by lot — HPLC for purity (${spec}) plus MS for mass — and the ${p.shortCode} certificate lists the measured values alongside the identity entry (${identity}).`,
      ];
      return { ...f, a: testVariants[seedOf(p.slug + 'test') % testVariants.length] };
    }
    return f;
  });
}

products.forEach(diversifyProduct);

/* Validation */
const slugs = new Set();for (const p of products) {
  if (slugs.has(p.slug)) throw new Error(`duplicate slug: ${p.slug}`);
  slugs.add(p.slug);
  if (!p.specs.length) throw new Error(`no specs: ${p.slug}`);
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
