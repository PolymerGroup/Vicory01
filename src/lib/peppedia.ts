/** PepPedia category metadata (mirrors the enum in content.config.ts) */
export const PEPPEDIA_CATEGORIES = {
  fundamentals: {
    label: 'Fundamentals',
    blurb: 'What research peptides are, how they are made and how they are supplied.',
    accent: 'ocean',
  },
  analytics: {
    label: 'Quality & Analytics',
    blurb: 'HPLC, mass spectrometry, certificates of analysis and release testing.',
    accent: 'brand',
  },
  handling: {
    label: 'Handling & Storage',
    blurb: 'Lyophilised powder, reconstitution, cold chain and lab best practice.',
    accent: 'ocean',
  },
  sourcing: {
    label: 'Sourcing & Supply',
    blurb: 'RFQ checklists, supplier evaluation, documentation and freight.',
    accent: 'brand',
  },
  chemistry: {
    label: 'Chemistry',
    blurb: 'Sequence notation, modifications, salts and copper-peptide chemistry.',
    accent: 'slate',
  },
} as const;

export type PeppediaCategory = keyof typeof PEPPEDIA_CATEGORIES;

export function categoryLabel(key: string): string {
  return PEPPEDIA_CATEGORIES[key as PeppediaCategory]?.label ?? 'Article';
}
