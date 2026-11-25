---
title: 'Copper Peptides (GHK-Cu, AHK-Cu) in Cosmetic Raw-Material Research'
description: 'The chemistry behind copper peptide raw materials: Cu(II) coordination, the blue colour, formulation compatibility, and how to verify copper content analytically.'
category: chemistry
tags: ['GHK-Cu', 'copper peptide', 'cosmetic raw material', 'ICP-MS']
publishedAt: 2026-09-01
readingMinutes: 5
relatedPeptides: ['ghk-cu', 'ahk-cu']
faqs:
  - q: 'Why is GHK-Cu blue?'
    a: 'The blue colour comes from Cu(II) coordinated to the peptide backbone — a d–d transition in the copper complex. Colour intensity is a rough visual indicator of complexation, but it is not a quantitative assay.'
  - q: 'What is the copper-to-peptide ratio in GHK-Cu?'
    a: 'The complex is conventionally described as 1:1, with Cu(II) bound through the N-terminal amine and the histidine imidazole. In practice, batch certificates should state the measured copper content rather than assume stoichiometry.'
  - q: 'Can copper peptides be combined with vitamin C or strong chelators?'
    a: 'Not in the same phase without compatibility testing. Ascorbic acid reduces Cu(II) and chelators strip the metal, both of which change the complex. Sequential application or separate phases are the usual formulation strategies.'
---

Copper peptides occupy a niche between peptide chemistry and inorganic coordination chemistry. They are sold as cosmetic raw materials and research reagents, and their analytical profile is unusual: the interesting part is not only the peptide, but the metal bound to it.

## The complex, not just the peptide

GHK-Cu is a tripeptide (glycyl-histidyl-lysine) complexed with copper(II). AHK-Cu follows the same pattern with an alanine in place of glycine. In both cases the metal is held by the N-terminal amine and the histidine imidazole, giving a square-planar-ish coordination that is responsible for the characteristic blue colour.

Two practical implications:

- **The colour is the complex.** A batch that is pale or greyish may be partially uncomplexed or oxidised; a very dark batch may have excess free copper.
- **The mass you weigh is the complex**, not the free peptide. Molecular weight calculations must include the copper.

## What belongs on the certificate

| Parameter | Method | Why |
| --- | --- | --- |
| Peptide identity | ESI-MS (peptide portion) | Confirms the sequence |
| Copper content | ICP-MS or AAS | Confirms complexation ratio |
| Appearance | Visual | Blue to deep-blue powder or solution |
| Purity (HPLC) | RP-HPLC | Peptide-related impurities |
| Water content | Karl Fischer | Powder handling and stability |
| Counter-ion | Stated | Typically acetate |

A certificate that reports only "GHK-Cu ≥99%" without a copper assay is describing the peptide, not the complex.

## Formulation compatibility

Copper complexes are sensitive to anything that competes for the metal or reduces it:

- **Reducing agents** (ascorbic acid, thiols) convert Cu(II) to Cu(I) and destabilise the complex.
- **Strong chelators** (EDTA, citrates at high concentration) strip copper from the peptide.
- **High pH** promotes hydrolysis and copper hydroxide formation; mildly acidic to neutral ranges are typical.
- **Anionic surfactants** can cause precipitation through charge interaction.

The standard approach is to formulate the copper peptide in a separate phase, or to sequence application in separate steps, and to confirm compatibility with a short accelerated stability check rather than assuming it.

## Analytical checks a formulator can run

Without a full QC laboratory:

1. **UV-Vis scan** — the complex absorbs in the visible region; a shift or loss of the band indicates decomposition.
2. **Colour comparison against a retained reference sample** — crude but effective for incoming inspection.
3. **pH of a 1% solution** — a large drift from the reference suggests a different salt form or partial decomplexation.
4. **Solubility check** — uncomplexed peptide and the complex do not behave identically in water/glycol systems.

## Sourcing notes

Copper peptides are among the most counterfeited cosmetic raw materials, largely because a blue powder is easy to imitate with dye. The two questions that filter most of it out:

- Can you provide the copper content by ICP-MS for this lot?
- Does the HPLC method resolve the peptide peak from free histidine and copper-free GHK?

If the answer to either is "we will ask the factory", the material is being brokered, not manufactured.

> This article discusses raw-material chemistry for research and formulation development. Products are supplied for laboratory and analytical use only; not for human or veterinary use.
