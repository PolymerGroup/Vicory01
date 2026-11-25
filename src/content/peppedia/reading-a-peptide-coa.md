---
title: 'How to Read a Peptide Certificate of Analysis (COA)'
description: 'Field-by-field walkthrough of a peptide COA: lot identification, RP-HPLC purity, ESI-MS identity, Karl Fischer water, endotoxin, and the red flags that mean “ask again”.'
category: analytics
tags: ['COA', 'RP-HPLC', 'ESI-MS', 'QA']
publishedAt: 2026-09-29
readingMinutes: 6
featured: true
relatedPeptides: ['bpc-157', 'tirzepatide', 'ghk-cu']
faqs:
  - q: 'Does a COA guarantee the next lot will be identical?'
    a: 'No. A COA is lot-specific by definition. It documents one batch. For a recurring study you should request the certificate for every lot you receive and archive them against your results.'
  - q: 'What is the difference between a product datasheet and a COA?'
    a: 'A datasheet describes the catalogue item in general — sequence, molecular weight, typical purity. A COA reports what was measured on one specific batch, with a lot number, methods and acceptance limits.'
  - q: 'Is a chromatogram image required on the COA?'
    a: 'It is good practice but not mandatory. What matters is the reported purity, the method, the wavelength and the retention time; the trace is supporting evidence that helps you sanity-check the number.'
---

A certificate of analysis is the only document that connects a number on a marketing page to a physical vial in your hand. Most problems with peptide supply are not "the material was fake" — they are "the certificate did not say what the buyer assumed". This page walks through the sections in the order they usually appear.

## 1. Lot identification

The first block must tie the document to a physical object:

- **Product name and short code** — matching the label on the vial.
- **Lot / batch number** — one identifier, printed identically on the vial label, the kit box and the certificate. A common scheme is `VC-2026-BC-01`: supplier prefix, year, product code, batch sequence.
- **Manufacture and release dates** — a certificate without a release date cannot be validated against storage time.
- **Quantity and pack format** — "10 vials × 10 mg", not just "10 mg".

If the lot number on the certificate does not appear on the vial, the document describes some other batch.

## 2. Identity: mass spectrometry

Identity is usually confirmed by **ESI-MS**, comparing the deconvoluted mass with the theoretical mass of the intended sequence. What to look for:

- **Observed mass vs theoretical mass**, both stated, with a tolerance (typically ±0.5 Da).
- **Charge state envelope** — for larger peptides, the multiply-charged series should be internally consistent.
- **Modifications reflected in the mass** — an acetylated or lipidated peptide has a different theoretical mass; if the certificate quotes the unmodified mass, the modification was not verified.

A single "identity: confirmed" line without numbers tells you nothing verifiable.

## 3. Purity: reversed-phase HPLC

The purity figure normally comes from **RP-HPLC with UV detection**, reported as area percentage. Four details determine whether the number is meaningful:

| Detail | Why it matters |
| --- | --- |
| Wavelength (214 nm vs 280 nm) | 214 nm detects the peptide backbone and shows more impurities; 280 nm only sees aromatic residues |
| Gradient and column | Shallow gradients resolve closely-eluting impurities that fast gradients merge into one peak |
| Integration threshold | Very small peaks can be excluded from area normalisation, inflating the result |
| Retention time | Confirms the main peak is where the method expects it |

Two suppliers can both report "99.2%" from methods that would give 96% and 99.2% on the same sample. Asking for the method is not pedantry; it is the difference between comparable and incomparable numbers.

## 4. Appearance and solubility

A lyophilised peptide should be described as a white to off-white cake or powder. Discolouration, shrinkage or a melted appearance suggests moisture ingress or a failed lyophilisation cycle. Solubility in a stated solvent is also worth recording, because it is the first thing your lab will notice.

## 5. Water content

Residual moisture is measured by **Karl Fischer titration**. Typical acceptance is ≤5% for lyophilised powder. Moisture matters for two reasons: it dilutes the peptide mass you are weighing, and it accelerates deamidation and aggregation during storage.

## 6. Endotoxin (where applicable)

Bacterial endotoxin is measured by **LAL assay**, usually reported in EU/mg. For cell-culture work this is often the specification that decides whether a lot is usable, and it is frequently missing from cheap certificates.

## 7. Salt form and counter-ion

Acetate, TFA and other counter-ions change the mass, the pH after reconstitution, and the behaviour of the peptide in cell culture. The certificate should state the salt form explicitly — and, for TFA, note that residual TFA can be undesirable in sensitive assays.

## 8. Authorisation

A released certificate carries a reviewer name or initials, a release date and a statement of the storage condition the release applies to. An unsigned PDF with no date is a template, not a record.

## Red flags worth escalating

1. Purity quoted to two decimals with no method, column or wavelength.
2. The same certificate PDF reused across different lot numbers.
3. Identity "confirmed" without observed and theoretical masses.
4. No water content and no salt form.
5. Sequenced but unreadable lot numbers (handwriting, stickers, "N/A").

None of these necessarily mean the material is bad. All of them mean you cannot tell, which is the same problem from a documentation standpoint.

> PepPedia articles describe analytical and procurement practice only. Products are supplied for research, laboratory and analytical use; not for human or veterinary use.
