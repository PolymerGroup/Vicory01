---
title: 'Reading Peptide Sequences: One-Letter Codes, Salts and Aliases'
description: 'How to decode a peptide sequence line — one-letter vs three-letter codes, acetylation, amidation, D-amino acids, disulfides and the acronyms that make two products look identical.'
category: chemistry
tags: ['sequence', 'nomenclature', 'modifications', 'aliases']
publishedAt: 2026-08-25
readingMinutes: 6
relatedPeptides: ['bpc-157', 'tb-500-thymosin-beta-4-fragment', 'cjc-1295-without-dac', 'cjc1295-with-dac']
faqs:
  - q: 'What does a trailing “-NH2” mean in a peptide name?'
    a: 'It indicates C-terminal amidation: the free carboxylic acid is replaced by an amide. This removes a negative charge, changes the molecular mass, and often improves stability against carboxypeptidases.'
  - q: 'Why do two products with the same sequence have different names?'
    a: 'Because they differ in modification, salt form or formulation rather than sequence. Brand names often encode a delivery or half-life modification that the sequence line does not show.'
  - q: 'Are one-letter and three-letter codes always interchangeable?'
    a: 'For standard residues, yes. Ambiguities appear with non-standard residues and modifications, which is why certificates usually include both the sequence and the calculated mass.'
---

A sequence line is a compressed specification. Once you can read it, several common confusions disappear — including the ones that make buyers think two different products are the same thing.

## One-letter and three-letter codes

Both encodings describe the same chain:

```
One-letter:  GEPPPGKPADDAGLV
Three-letter: H-Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val-OH
```

The one-letter form is compact and standard in databases; the three-letter form is more readable and is what most certificates use for short peptides. `H-` marks the free N-terminus and `-OH` the free C-terminus.

## The modifications that change everything

Modifications are usually written as prefixes or suffixes around the sequence. The important ones:

| Notation | Meaning | Consequence |
| --- | --- | --- |
| `Ac-` | N-terminal acetylation | Blocks the N-terminus; +42 Da |
| `-NH2` | C-terminal amidation | Removes a charge; −1 Da vs free acid |
| `pGlu` | Pyroglutamate | Cyclised N-terminal Glu; −18 Da |
| `[D-Ala²]` | D-amino acid at position 2 | Alters folding and stability |
| `(Cys2–Cys7)` | Disulfide bridge | Constrains conformation |
| `PEG-` | PEGylation | Large mass increase, slower clearance in vivo |
| `-lipid` / acyl chain | Lipidation | Strong hydrophobicity, albumin binding |

Each modification changes the molecular mass. That is why a certificate should quote the **theoretical mass of the modified sequence**, not of the bare chain.

## Sequence is not the whole product

This is where most procurement confusion originates. Consider three cases from the catalogue:

- **CJC-1295 without DAC** and **CJC-1295 with DAC** share a core sequence but differ by the drug-affinity complex (DAC) that binds albumin. Different mass, different stability, different price. A quote that says only "CJC-1295" is ambiguous.
- **TB-500** is described as a fragment of thymosin β4, not the full protein. The fragment number is part of the specification.
- **Semaglutide** carries a lipid chain and a non-natural residue; the sequence line alone does not capture the delivery behaviour.

## Salt form: the invisible half of the name

"GHK-Cu" is a copper complex. "BPC-157 acetate" and "BPC-157 TFA" are the same peptide with different counter-ions. "Gonadorelin" and "Gonadorelin acetate" differ by the salt, and their masses differ accordingly.

When comparing quotes, always normalise to the same salt form before comparing price per milligram.

## Aliases and what they hide

The research market uses several parallel naming systems:

- **INN / generic names** — bremelanotide, cibinetide, elamipretide.
- **Code names** — PT-141, ARA-290, SS-31, LY3437943.
- **Descriptive names** — "HGH fragment 176-191", "thymosin beta-4 fragment".
- **Trivial trade names** — which we deliberately do not use in product titles or structured data.

A catalogue item should expose its aliases (for search) while keeping one canonical name (for comparison, URLs and structured data). That is exactly what this site does: `alternateName` in JSON-LD lists the aliases, and the canonical slug stays stable.

## A quick decoding workflow

1. Read the sequence and count residues.
2. Note every prefix/suffix and any bracketed modification.
3. Check the theoretical mass against the modifications you found.
4. Confirm the salt form.
5. Compare against the CAS number or INN if one is published.

If the certificate's theoretical mass does not match the sequence plus modifications you can see, one of the three is wrong — and that is worth an email before you order.

> Nomenclature guidance only. Products are supplied for research, laboratory and analytical use; not for human or veterinary use.
