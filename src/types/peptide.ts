/** 与 src/data/peptides.json 一一对应的类型定义（构建期校验用） */

export interface Tier {
  min: number;
  max: number | null;
  price: number;
  label: string;
}

export interface Spec {
  spec: string;
  label: string;
  strength: number | null;
  unit: string;
  vials: number;
  perKit: number | null;
  perVial: number | null;
  tiers: Tier[];
  tierFrom: number | null;
}

export interface Coa {
  isSpecimen: boolean;
  lotFormat: string;
  lotExample: string;
  method: string;
  appearance: string;
  puritySpec: string;
  moistureSpec: string;
  endotoxinSpec: string;
  storage: string;
  chromatogram: boolean;
  disclaimer: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Peptide {
  id: string;
  slug: string;
  name: string;
  shortCode: string;
  aliases: string[];
  searchTerms: string;
  category: string;
  categoryLabel: string;
  categoryShort: string;
  tags: string[];
  sequenceType: string;
  moleculeClass: string;
  form: 'lyophilized_powder' | 'sterile_solution' | 'mixed';
  appearance: string;
  purity: string | null;
  purityVerified: boolean;
  storage: {
    lyophilized: string | null;
    solution: string | null;
    reconstituted: string | null;
    summary: string;
  };
  cas: string | null;
  sequence: string | null;
  formula: string | null;
  molecularWeight: string | null;
  chemistryStatus: 'documented' | 'pending-coa';
  composition: { component: string; amount: string }[];
  kitVials: number;
  specs: Spec[];
  priceFrom: number | null;
  priceTo: number | null;
  currency: string;
  priceUnit: string;
  moqKits: number;
  geoSummary: string;
  faqs: Faq[];
  coa: Coa;
  imageUrl: string | null;
  coaPdfUrl: string | null;
}

export interface Category {
  key: string;
  label: string;
  short: string;
  blurb: string;
  accent: string;
  icon: string;
  count: number;
}

export interface PeptideData {
  generatedAt: string;
  sourceVersion: string;
  currency: string;
  priceUnit: string;
  productCount: number;
  categories: Category[];
  products: Peptide[];
}
