/**
 * 分类落地页内容（A1）
 * 每个分类一个独立可索引 URL：/categories/{slug}
 * 与 /llms/{slug}.txt 使用同一套 slug，便于机器与人类读到同一棵树。
 */
export interface CategoryPage {
  key: string;
  slug: string;
  navLabel: string;
  h1: string;
  title: string;
  description: string;
  intro: string[];
  highlights: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    key: 'glp1_metabolic',
    slug: 'glp1-metabolic',
    navLabel: 'Metabolic',
    h1: 'GLP-1, GIP and Metabolic Research Peptides',
    title: 'GLP-1 & Metabolic Peptides — Kits, COA & Tier Pricing | Dchemi',
    description:
      'Semaglutide, tirzepatide, retatrutide, liraglutide and related incretin research peptides, supplied as 10-vial lyophilized kits with batch COA and per-kit tier pricing.',
    intro: [
      'This category covers incretin-mimetic and metabolic research peptides: GLP-1 receptor agonists, dual GIP/GLP-1 agonists, triple agonists, amylin analogues and small-molecule metabolic tool compounds. The catalogue carries sixteen products in this group, supplied as lyophilized powder in 10-vial kits.',
      'The analytical differences inside the group are substantial. Backbones range from 31 residues (semaglutide) to 39 residues (tirzepatide, retatrutide), and most carry a fatty-acid side chain that dominates reversed-phase retention. Mass, acylation chemistry and receptor profile — not trade name — are what a validated method has to key on, and each product page states the parameters the catalogue actually holds.',
    ],
    highlights: [
      {
        title: 'Incretin mimetics',
        body: 'GLP-1, dual GIP/GLP-1 and triple GCGR/GIP/GLP-1 agonists share an incretin mechanism but differ in backbone length and lipidation.',
      },
      {
        title: 'Metabolic tool compounds',
        body: 'Small molecules such as AICAR, 5-Amino-1MQ and SLU-PP-332 are supplied alongside the peptide series for pathway-level work.',
      },
      {
        title: 'Analytical notes',
        body: 'Acylated peptides require their own reference standard and gradient; a method transferred between analogues will usually lose sensitivity.',
      },
    ],
    faqs: [
      {
        q: 'Are the GLP-1 peptides in this category supplied as ready-to-use pens?',
        a: 'No. Every product in this category is lyophilized powder in a 10-vial kit and must be reconstituted in the laboratory. There are no pens, cartridges or pre-filled devices in the catalogue.',
      },
      {
        q: 'How do I tell semaglutide and tirzepatide apart analytically?',
        a: 'Backbone length (31 versus 39 residues), molecular weight (4114 versus 4813 Da) and receptor profile. The comparison page lists the parameters side by side.',
      },
      {
        q: 'Do these products come with a certificate of analysis?',
        a: 'Yes — each lot carries RP-HPLC purity and ESI-MS identity data in a batch-specific COA. Request the lot number before ordering if your SOP requires it.',
      },
    ],
  },

  {
    key: 'repair_recovery',
    slug: 'repair-recovery',
    navLabel: 'Repair',
    h1: 'Repair & Recovery Research Peptides',
    title: 'Repair & Recovery Peptides — Kits & COA | Dchemi',
    description:
      'BPC-157, TB-500, LL-37, KPV, thymosin alpha-1 and related repair-research peptides in 10-vial lyophilized kits, with batch COA and per-kit tier pricing.',
    intro: [
      'The repair and recovery group collects peptides that appear in tissue-repair-adjacent research: gastric-derived fragments, thymosin fragments, antimicrobial peptides and short immunomodulatory sequences. It is a structurally heterogeneous set — sequence length in this category runs from seven residues (TB-500, KPV) to thirty-seven (LL-37).',
      'Because the group is heterogeneous, the catalogue is explicit about what is known and what is not. Products with a published CAS number and molecular formula carry them on the page; the rest state that chemistry is published in the batch certificate of analysis rather than guessing at a value.',
    ],
    highlights: [
      {
        title: 'Gastric-derived fragments',
        body: 'BPC-157 is a 15-residue pentadecapeptide with a reported stability advantage in acidic media.',
      },
      {
        title: 'Thymosin fragments',
        body: 'TB-500 is the acetylated 17–23 fragment of thymosin β4 — 889 Da, an order of magnitude smaller than the parent protein.',
      },
      {
        title: 'Antimicrobial peptides',
        body: 'LL-37 is a 37-residue cathelicidin-derived peptide; KPV is a tripeptide fragment of α-MSH.',
      },
    ],
    faqs: [
      {
        q: 'Which products in this category have a verified CAS number?',
        a: 'Each product page shows the CAS number where the catalogue holds a verified value; where it does not, the page says the value is published in the batch COA.',
      },
      {
        q: 'Why is TB-500 so much smaller than BPC-157?',
        a: 'TB-500 is a 7-residue fragment (889 Da); BPC-157 is a 15-residue peptide (1419.5 Da). They are structurally unrelated.',
      },
      {
        q: 'Are these peptides supplied sterile?',
        a: 'No. They are lyophilized powders in 10-vial kits and are not sterile injectables. Laboratory reconstitution and handling apply.',
      },
    ],
  },

  {
    key: 'cosmetic_antiaging',
    slug: 'cosmetic-antiaging',
    navLabel: 'Cosmetic',
    h1: 'Cosmetic & Dermal Research Peptides',
    title: 'Cosmetic Peptides — GHK-Cu, Matrixyl, SNAP-8 | Dchemi',
    description:
      'Copper peptides (GHK-Cu, AHK-Cu), signal peptides (Matrixyl, SNAP-8) and dermal research blends supplied as 10-vial kits with batch COA and tier pricing.',
    intro: [
      'Cosmetic research peptides fall into two practical groups: metal-complex tripeptides that carry copper, and short signal or carrier peptides that are usually studied as topical or in-vitro actives. The catalogue covers both, plus multi-component dermal blends.',
      'The copper peptides are the ones where analytical method matters most: a peptide-purity assay does not confirm that copper is bound, so the certificate of analysis should report copper content alongside RP-HPLC purity. For the signal peptides, the relevant checks are sequence identity and the presence of the terminal acetyl or amide groups that define the molecule.',
    ],
    highlights: [
      {
        title: 'Copper tripeptides',
        body: 'GHK-Cu (403.93 Da) and AHK-Cu (415.94 Da) differ by one N-terminal residue; copper content is the parameter worth verifying.',
      },
      {
        title: 'Signal peptides',
        body: 'Matrixyl (palmitoyl pentapeptide-4) and SNAP-8 (acetyl octapeptide-3) are supplied as cosmetic-research reference materials.',
      },
      {
        title: 'Dermal blends',
        body: 'Fixed-composition blends are supplied with a component-level COA rather than a single molecular formula.',
      },
    ],
    faqs: [
      {
        q: 'What should a GHK-Cu certificate of analysis report?',
        a: 'Peptide purity by RP-HPLC, identity by MS, and copper content — a peptide-only assay does not prove stoichiometric metal binding.',
      },
      {
        q: 'Are cosmetic peptides in this category supplied with a preservative?',
        a: 'No. They are dry powders. Any preservative or carrier is added by you at formulation stage, not by the catalogue.',
      },
      {
        q: 'Can the same method quantify GHK-Cu and AHK-Cu?',
        a: 'They differ by 12 Da and by retention behaviour, so a method must be developed against each reference standard separately.',
      },
    ],
  },

  {
    key: 'gh_secretagogue',
    slug: 'gh-secretagogues',
    navLabel: 'GH Secretagogues',
    h1: 'Growth Hormone Secretagogue Research Peptides',
    title: 'GH Secretagogues — Ipamorelin, GHRP-6, CJC-1295 | Dchemi',
    description:
      'GHRH analogues and ghrelin-receptor mimetics — ipamorelin, GHRP-6, GHRP-2, hexarelin, CJC-1295, sermorelin, tesamorelin — supplied as 10-vial kits with COA.',
    intro: [
      'Growth hormone secretagogues split into two mechanistic families: GHRH analogues that act on the pituitary GHRH receptor (sermorelin, CJC-1295, tesamorelin) and ghrelin-receptor mimetics (ipamorelin, GHRP-2, GHRP-6, hexarelin). Most of the small ghrelin mimetics are heavily modified — D-amino acids, 2-naphthylalanine, Aib and a C-terminal amide — which is why they behave unlike typical linear peptides on HPLC.',
      'The practical consequence for a laboratory is that UV quantitation is unreliable for most of this group: only the tryptophan-containing sequences (GHRP-2, GHRP-6, hexarelin) have usable absorbance near 280 nm. For the rest, mass spectrometric detection or an established derivatisation method is needed.',
    ],
    highlights: [
      {
        title: 'GHRH analogues',
        body: 'Sermorelin is GRF(1-29); CJC-1295 adds a DAC conjugate (+≈289 Da); tesamorelin extends the backbone to 44 residues.',
      },
      {
        title: 'Ghrelin mimetics',
        body: 'Ipamorelin (5 residues), GHRP-2 and GHRP-6 (6 residues) and hexarelin share a C-terminal amide and non-natural residues.',
      },
      {
        title: 'Detection',
        body: 'Only tryptophan-bearing members are suitable for A280 quantitation; the others need MS-based methods.',
      },
    ],
    faqs: [
      {
        q: 'What is the difference between a GHRH analogue and a ghrelin mimetic?',
        a: 'They act on different receptors: GHRH analogues target the pituitary GHRH receptor, while GHRP-class peptides act at the ghrelin receptor. The structural families are likewise different.',
      },
      {
        q: 'Why do these peptides carry a C-terminal amide?',
        a: 'Amidation removes the C-terminal charge and improves stability; it also lowers the mass by ~0.98 Da relative to the free acid, which matters for MS identification.',
      },
      {
        q: 'Is MK-677 a peptide?',
        a: 'No. MK-677 (ibutamoren) is a small-molecule ghrelin-receptor agonist supplied in the same category for convenience, not a peptide.',
      },
    ],
  },

  {
    key: 'bioregulator',
    slug: 'bioregulators',
    navLabel: 'Bioregulators',
    h1: 'Bioregulator & Longevity Research Peptides',
    title: 'Bioregulator Peptides — Short Peptides & Kits | Dchemi',
    description:
      'Short synthetic bioregulator peptides — Epitalon, Pinealon, Cartalax, Livagen, Thymalin and related sequences — supplied as 10-vial lyophilized kits with batch COA.',
    intro: [
      'Bioregulators are short synthetic peptides — typically two to four residues — studied in the gerontology and tissue-specific research literature. Many share an acidic motif: Ala-Glu-Asp appears in several catalogue entries (Cartalax, Bronchogen, Cortagen, Livagen), while Epitalon is Ala-Glu-Asp-Gly and Pinealon is Glu-Asp-Arg.',
      'The practical caveat for this category is documentation. Public chemical databases hold only a subset of these sequences, so the catalogue marks a value as published only where it has been verified; the remainder states that the parameter is published in the batch COA. Buyers running regulated work should request the lot COA before committing.',
    ],
    highlights: [
      {
        title: 'Short acidic peptides',
        body: 'AED, AEDG, AEDL, AEDP, AEDK and EDR are among the most compact molecules in the catalogue — 333 to 462 Da.',
      },
      {
        title: 'Thymic and pineal fractions',
        body: 'Thymalin (thymulin) and Epitalon represent the thymic and pineal research lineages respectively.',
      },
      {
        title: 'Documentation first',
        body: 'Where a public CAS registry entry does not exist, the page says so rather than asserting a value.',
      },
    ],
    faqs: [
      {
        q: 'Why do several bioregulators share the Ala-Glu-Asp motif?',
        a: 'They belong to the same short-peptide family studied for tissue-specific effects; the motif recurs across the series with different terminal residues.',
      },
      {
        q: 'Do all bioregulators have a CAS number?',
        a: 'No. Several short peptides have no public CAS registry entry. The catalogue shows a value only where verified and otherwise points to the batch COA.',
      },
      {
        q: 'What pack sizes are available?',
        a: 'Most items ship in 10-vial kits at several strengths; the product page lists the exact pack sizes and per-kit tier pricing.',
      },
    ],
  },

  {
    key: 'blend',
    slug: 'blends',
    navLabel: 'Blends',
    h1: 'Multi-Component Peptide Blends',
    title: 'Peptide Blends — Fixed-Composition Kits | Dchemi',
    description:
      'Fixed-composition multi-peptide blends (BPC-157 + TB-500, GLOW, KLOW, CagriSema and others) supplied as 10-vial kits with component-level COA.',
    intro: [
      'Blends are fixed-composition vials containing two or more peptides at a stated ratio. The catalogue lists each component and its amount per vial, so a buyer can reconstruct the composition rather than relying on a trade name.',
      'Analytically, blends are the hardest items in the catalogue: components co-elute under a single gradient, so a blend COA is only meaningful when it reports per-component identity and content. The product pages list the component CAS numbers in sequence, and the certificate of analysis is the authoritative document.',
    ],
    highlights: [
      {
        title: 'Two-component blends',
        body: 'BPC-157 + TB-500, CJC-1295 + Ipamorelin, Tesamorelin + Ipamorelin and CagriSema are supplied at stated ratios.',
      },
      {
        title: 'Multi-component blends',
        body: 'GLOW and KLOW combine three to four peptides; the component list and per-vial amounts are published on the page.',
      },
      {
        title: 'COA structure',
        body: 'A blend COA should report each component separately — a single purity figure cannot describe a mixture.',
      },
    ],
    faqs: [
      {
        q: 'Can I get the individual components instead of the blend?',
        a: 'Yes. Every component peptide is also a standalone catalogue item, which is usually the better route if your method cannot resolve the mixture.',
      },
      {
        q: 'How is blend purity reported?',
        a: 'Per component. Each lot COA lists identity and content for the individual peptides rather than a single aggregate percentage.',
      },
      {
        q: 'Are the ratios customisable?',
        a: 'Fixed-composition blends ship as listed. Custom ratios are handled as an OEM enquiry through the RFQ form.',
      },
    ],
  },

  {
    key: 'solvent_ancillary',
    slug: 'ancillary',
    navLabel: 'Ancillary',
    h1: 'Reconstitution Solvents & Ancillary Reagents',
    title: 'Ancillary Reagents — BAC Water, Acetic Acid, Vitamins | Dchemi',
    description:
      'Bacteriostatic water, 0.6% acetic acid, benzyl alcohol and ancillary reagents supplied in 10-vial kits for laboratory reconstitution, with batch COA.',
    intro: [
      'Ancillary reagents are the materials used around a peptide experiment rather than the analyte itself: reconstitution solvents, acidified water, preservative solutions and a small group of non-peptide injectables. The catalogue supplies them in the same 10-vial kit format as the peptides.',
      'For these items the relevant identity is that of the active component. Bacteriostatic water is water containing 0.9% benzyl alcohol; 0.6% acetic acid solution is acetic acid in water. The product pages state the active ingredient and its CAS number, and multi-component formulations explicitly say that composition is component-specific on the COA.',
    ],
    highlights: [
      {
        title: 'Reconstitution solvents',
        body: 'Bacteriostatic water and 0.6% acetic acid are the two standard reconstitution media in the catalogue.',
      },
      {
        title: 'Active-ingredient identity',
        body: 'Benzyl alcohol (100-51-6) and acetic acid (64-19-7) are the actives behind the solvent products.',
      },
      {
        title: 'Non-peptide reagents',
        body: 'Vitamin B12, B6, C, D2 and L-carnitine are supplied as ancillary reference materials, not as therapeutics.',
      },
    ],
    faqs: [
      {
        q: 'What is bacteriostatic water?',
        a: 'Sterile water containing 0.9% benzyl alcohol as a bacteriostatic preservative. The active ingredient is benzyl alcohol, CAS 100-51-6.',
      },
      {
        q: 'Which solvent should I use for a given peptide?',
        a: 'It depends on the peptide’s solubility: acidic peptides are often reconstituted in dilute acetic acid, while neutral lyophilized powders usually dissolve in water. The product page states the storage form.',
      },
      {
        q: 'Are the vitamin injections therapeutic products?',
        a: 'No. They are listed as ancillary laboratory reference materials and are not for human or veterinary administration.',
      },
    ],
  },
];

export const categoryBySlug = (slug: string) => CATEGORY_PAGES.find((c) => c.slug === slug);
