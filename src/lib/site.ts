/**
 * 站点级常量与工具函数。
 * 任何页面都从这里取品牌信息，避免硬编码散落各处。
 */
export const SITE = {
  url: 'https://dchemi.com',
  origin: 'https://dchemi.com',
  name: 'Dchemi',
  tagline: 'Research-Grade Peptides, Supplied by the Kit',
  legalName: 'Shandong Vicory Biotechnology Co., Ltd.',
  legalNameZh: '山东维科瑞生物科技有限公司',
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
   * 已验证的官方外链（Organization.sameAs）。
   * 只放真实存在的账号；拿到 LinkedIn / YouTube / GitHub 链接后填进来即可。
   */
  social: [] as string[],
  currency: 'USD',
  priceUnit: 'Kit (10 vials)',
  fxFilename: 'dchemi-price-list-2026.csv',
} as const;

export const NAV = [
  { href: '/products', label: 'All Peptides' },
  { href: '/products?category=glp1_metabolic', label: 'Metabolic' },
  { href: '/products?category=repair_recovery', label: 'Repair' },
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

/** 询盘话术：统一的 RFQ 邮件主题 */
export function rfqSubject(extra?: string): string {
  return `B2B RFQ — Dchemi${extra ? ` — ${extra}` : ''}`;
}

/** JSON-LD 安全序列化：避免 `</script>` 注入，并保持中文可读 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
