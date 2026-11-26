/**
 * Site-wide constants and helpers.
 * Pages read brand data from here instead of hard-coding it.
 */
export const SITE = {
  url: 'https://dchemi.com',
  origin: 'https://dchemi.com',
  name: 'Dchemi',
  tagline: 'Research-Grade Peptides, Supplied by the Kit',
  legalName: 'Shandong Vicory Biotechnology Co., Ltd.',
  email: 'info@dchemi.com',
  phone: '+86 15866781826',
  phoneHref: 'tel:+8615866781826',
  whatsapp: 'https://wa.me/8615866781826',
  logo: '/images/logo.png',
  logoWidth: 512,
  logoHeight: 512,
  addressCountry: 'CN',
  addressRegion: 'Shandong',
  addressLocality: 'Jinan',
  ruo: 'For Research, Laboratory, and Analytical Use Only. Not for Human or Veterinary Use.',
  ruoShort: 'Research use only. Not for human or veterinary use.',
  established: '2016',
  /**
   * Verified official profiles (Organization.sameAs).
   * Only real accounts; add LinkedIn / YouTube / GitHub URLs once available.
   */
  social: [] as string[],
  currency: 'USD',
  priceUnit: 'Kit (10 vials)',
  fxFilename: 'dchemi-price-list-2026.csv',
} as const;

export const NAV = [
  { href: '/products', label: 'Catalogue' },
  { href: '/peptides/glp1-metabolic', label: 'Metabolic' },
  { href: '/peptides/repair-recovery', label: 'Repair' },
  { href: '/compare', label: 'Compare' },
  { href: '/peppedia', label: 'PepPedia' },
  { href: '/about-compliance', label: 'About' },
  { href: '/rfq', label: 'Request Quote' },
] as const;

export function money(value: number | null | undefined, currency = 'USD'): string {
  if (value == null || Number.isNaN(Number(value))) return 'RFQ';
  const symbol = currency === 'USD' ? '$' : '';
  return `${symbol}${Number(value).toFixed(2)}`;
}

export function abs(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function kitLabel(vials = 10): string {
  return `${vials} vials/kit`;
}

/** Single RFQ email subject used everywhere */
export function rfqSubject(extra?: string): string {
  return `B2B RFQ — Dchemi${extra ? ` — ${extra}` : ''}`;
}

/** Safe JSON-LD serialisation (no </script> injection, readable output) */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
