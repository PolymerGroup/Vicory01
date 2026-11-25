---
title: 'Purity vs. Content: The Two Numbers Buyers Confuse'
description: 'HPLC purity and peptide content are not the same measurement. Why a 99% pure vial can contain far less than 99% peptide, and how salt form and moisture change your calculations.'
category: analytics
tags: ['purity', 'content', 'mass balance', 'salt form']
publishedAt: 2026-09-22
readingMinutes: 5
relatedPeptides: ['bpc-157', 'cjc-1295-without-dac', 'semaglutide']
faqs:
  - q: 'If purity is 99%, is the vial 99% peptide?'
    a: 'No. Purity is a chromatographic area percentage — it compares the target peak with other UV-absorbing peaks. It says nothing about counter-ion mass, residual water or non-UV-absorbing material.'
  - q: 'How is peptide content measured?'
    a: 'Typically by mass balance: gross vial mass, net powder mass, then correction for water (Karl Fischer), counter-ion (ion chromatography or titration) and, in some labs, nitrogen content by elemental analysis.'
  - q: 'Does salt form really change the weight that much?'
    a: 'It can. Acetate and TFA salts add mass per charged residue; for a highly charged peptide the counter-ion can account for a meaningful percentage of the powder you weigh out.'
---

Two certificates can both say "≥99%" and still describe vials that differ by 15% in the amount of peptide you can actually dissolve. The confusion comes from reading *purity*, *content* and *net weight* as the same thing. They are three different measurements taken at three different stages.

## Purity is relative

HPLC purity is an **area percentage**: the target peak divided by the sum of all integrated peaks, measured at a chosen wavelength. The denominator only contains things that absorb UV at that wavelength.

Three consequences follow:

- A peptide that is 99% pure by area can still be 80% peptide by mass, because the remaining 20% is counter-ion, water and non-chromophoric material that never appears in the chromatogram.
- Purity says nothing about the absolute amount of material. A 10 mg vial of 99% pure peptide and a 10 mg vial of 85% pure peptide weigh the same.
- Two "99%" figures from different wavelengths or gradients are not comparable.

## Content is absolute

**Peptide content** answers a different question: of the powder in this vial, what fraction is the peptide molecule itself? It is derived by mass balance:

```
net powder mass
  − water (Karl Fischer)
  − counter-ion (acetate / TFA / chloride)
  − residual solvents & inorganics
  = peptide mass
```

Content is the number you need when you are preparing a solution of known molarity. Purity tells you how clean the peptide is; content tells you how much of it is there. A certificate that reports only the first is incomplete for quantitative work.

## Why salt form matters more than people expect

Peptides carry charges. Each charged residue drags a counter-ion into the powder. Acetate (≈59 g/mol) and TFA (≈113 g/mol) are the usual partners, and the difference is not cosmetic:

| Item | Acetate salt | TFA salt |
| --- | --- | --- |
| Counter-ion mass per charge | ~59 g/mol | ~113 g/mol |
| pH after reconstitution | mildly acidic | strongly acidic |
| Cell-culture compatibility | usually preferred | can inhibit sensitive assays |
| Hygroscopicity | moderate | often higher |

For a peptide with several basic residues, the TFA salt can weigh measurably more than the acetate salt of the same sequence. If your protocol assumes "10 mg of peptide" and the vial contains the TFA salt, your molarity is off before you start.

## Water content is the quiet third variable

Lyophilised powder is not anhydrous. Karl Fischer values of 2–5% are routine; above that the material is both diluted and less stable, because residual water drives deamidation and aggregation. A vial at 6% water has 6% less peptide per milligram of powder than the certificate's nominal weight suggests.

## A practical reconciliation

When a quote and a certificate disagree, reconcile in this order:

1. **Gross vs net** — is the quoted weight the fill weight of peptide, or the total powder mass including salt and water?
2. **Salt form** — acetate or TFA, and how many charges does the sequence carry?
3. **Water content** — subtract it before comparing to a competitor's "10 mg".
4. **Purity method** — same wavelength, same gradient? If not, read the numbers as ordinal, not absolute.

None of this requires a QC laboratory on your side. It requires the supplier to state four things on the certificate: net peptide content, salt form, water content and the HPLC method. Suppliers who cannot are usually reselling.

> This article covers analytical interpretation only. All products are supplied for research, laboratory and analytical use; not for human or veterinary use.
