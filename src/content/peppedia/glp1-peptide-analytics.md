---
title: 'Analytical Testing of GLP-1, GIP and Amylin-Class Peptides'
description: 'Why lipidated and modified metabolic peptides are harder to analyse than they look: aggregation, deamidation, carryover and the chromatography choices that separate a real 99% from a flattering one.'
category: analytics
tags: ['GLP-1', 'LC-MS', 'aggregation', 'method development']
publishedAt: 2026-09-08
readingMinutes: 7
relatedPeptides: ['semaglutide', 'tirzepatide', 'retatrutide', 'cagrilintide']
faqs:
  - q: 'Why do GLP-1-class peptides show broad or split peaks on HPLC?'
    a: 'Common causes are on-column aggregation, partial deamidation, disulfide scrambling in cysteine-containing analogues, and slow equilibration between conformers. A shallow gradient and a heated column usually resolve the question.'
  - q: 'Is UV purity enough for a lipidated peptide?'
    a: 'Not on its own. Lipidated analogues may carry impurities with similar chromophores but different acylation states. Mass confirmation, and ideally a second orthogonal method, is needed to establish identity and purity together.'
  - q: 'What causes carryover between injections?'
    a: 'Hydrophobic, lipidated peptides adsorb to tubing, seals and the column inlet. Blank injections and a stronger wash solvent are the standard mitigations, and both should be part of method validation.'
---

Metabolic peptides — GLP-1, GIP and amylin analogues — are among the most commercially visible products in the research catalogue and among the least forgiving analytically. They combine high hydrophobicity, site-specific modification and a strong tendency to self-associate. A method optimised for a simple linear peptide will often report a confident number that does not survive a second look.

## What makes this class different

| Feature | Analytical consequence |
| --- | --- |
| Lipid/acyl chains (semaglutide, tirzepatide, cagrilintide) | Strong retention, carryover, poor peak shape in high-water gradients |
| Long sequences (30–40 residues) | More deletion/truncation variants with similar retention |
| Deamidation-prone Asn/Gln | +1 Da variants that co-elute with the main peak |
| Disulfide or lactam constraints | Scrambling and isoform formation during sample prep |
| Self-association | Concentration-dependent peak splitting and apparent "impurity" |

None of these are defects in the product by default. They are defects in the *method* if the method does not account for them.

## Sample preparation

Small choices change the answer:

- **Dissolve at low concentration** (0.1–0.5 mg/mL) to reduce on-column aggregation.
- **Use a solvent that matches the mobile-phase starting condition**, not pure water, to avoid a injection-solvent strength mismatch that distorts early peaks.
- **Prepare fresh.** A sample left on the autosampler at room temperature for 24 hours is not the same sample.
- **Filter or centrifuge** if the peptide is not fully dissolved; undissolved aggregate shows up as a low recovery, not a low purity.

## Chromatography

For lipidated analogues, a few parameters do most of the work:

1. **Shallow gradient** — 0.3–0.5% B per minute over the elution window, so closely-related variants separate.
2. **Column temperature** — 40–60 °C reduces peak broadening and secondary interactions; check that the peptide tolerates it.
3. **Ion-pairing agent** — TFA at 0.05–0.1% is standard, though formic acid is preferable when the same method feeds a mass spectrometer.
4. **Wash step** — a high-organic needle wash between injections to control carryover.

Report the wavelength, the gradient and the integration threshold alongside the purity figure. Without them, "99.2%" is not reproducible.

## Mass confirmation

UV alone cannot distinguish a deamidated variant from the parent, or a mono-acylated product from a di-acylated one. **ESI-MS with deconvolution** should be part of release testing for this class, and the certificate should state observed and theoretical mass.

For blends — for example a fixed combination of two metabolic peptides — the analytical question changes: you need a method that resolves both components *and* their individual impurity profiles. A single "purity" figure for a blend is close to meaningless unless it is defined per component.

## What a good certificate looks like for this class

- Purity at a stated wavelength, with method details.
- Observed vs theoretical mass, with the modification accounted for in the theoretical value.
- Water content by Karl Fischer.
- Salt form, since these peptides are usually acetate or TFA salts.
- For blends: composition per vial and a per-component assay.

## A note on comparing suppliers

Because these molecules are in demand, the market contains a wide range of material described with identical-sounding paperwork. The discriminating questions are unglamorous: which column, which gradient, which wavelength, and can you send the chromatogram for this lot? A supplier who can answer in one email is generally the one whose "99%" means what you think it means.

> Analytical discussion only. All products are supplied for research, laboratory and analytical purposes; not for human or veterinary use.
