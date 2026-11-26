/**
 * Comparison page data (the format AI answers cite most often).
 *
 * Writing rules:
 *  - structure, physicochemical parameters, receptor class and supply format only; no efficacy or dosing claims
 *  - numbers must match peptides.json; the page re-renders a data table to cross-check
 *  - pharmacokinetic values are always marked "reported"
 */
export interface ComparisonRow {
  label: string;
  a: string;
  b: string;
}

export interface Comparison {
  pair: string;
  a: string;
  b: string;
  title: string;
  description: string;
  lead: string;
  intro: string[];
  rows: ComparisonRow[];
  chooseA: string;
  chooseB: string;
  faqs: { q: string; a: string }[];
}

export const COMPARISONS: Comparison[] = [
  {
    pair: 'semaglutide-vs-tirzepatide',
    a: 'semaglutide',
    b: 'tirzepatide',
    title: 'Semaglutide vs Tirzepatide — Analytical Comparison | Dchemi',
    description:
      'Side-by-side comparison of semaglutide and tirzepatide: backbone length, receptor class, fatty-acid acylation, molecular formula and weight, CAS numbers, and per-kit catalogue pricing.',
    lead:
      'Semaglutide is a 31-residue acylated GLP-1 receptor agonist; tirzepatide is a 39-residue dual GIP/GLP-1 receptor agonist.',
    intro: [
      'Both molecules belong to the incretin-mimetic class of research peptides, but they are built on different backbones and are distinguished analytically by length, acylation chemistry and receptor selectivity. Semaglutide keeps a GLP-1(7-37)-derived sequence with Aib at position 8 and a C18 fatty diacid attached through an AEEA-AEEA-γ-glutamate linker at Lys20. Tirzepatide is longer, carries a C20 diacid on a different linker position, and combines GIP-receptor with GLP-1-receptor activity.',
      'For laboratory work the practical differences are mass, solubility behaviour and chromatographic profile: the two peptides resolve differently on RP-HPLC and must be quantified against their own reference standards. Neither compound is supplied for human or veterinary use; both are catalogue items for analytical and in-vitro research.',
    ],
    rows: [
      { label: 'Backbone length', a: '31 residues', b: '39 residues' },
      { label: 'Receptor class', a: 'GLP-1 receptor agonist', b: 'Dual GIP / GLP-1 receptor agonist' },
      { label: 'Non-natural residue', a: 'Aib at position 8', b: 'Aib at position 2' },
      { label: 'Lipid modification', a: 'C18 diacid via AEEA-AEEA-γGlu at Lys20', b: 'C20 diacid on the side chain' },
      { label: 'Molecular formula', a: 'C187H291N45O59', b: 'C225H348N48O68' },
      { label: 'Molecular weight', a: '4114 Da', b: '4813 Da' },
      { label: 'CAS number', a: '910463-68-2', b: '2023788-19-2' },
      { label: 'Reported half-life', a: '≈7 days (literature)', b: '≈5 days (literature)' },
      { label: 'Catalogue form', a: 'Lyophilized powder, 10-vial kits', b: 'Lyophilized powder, 10-vial kits' },
    ],
    chooseA:
      'Semaglutide when the assay needs a single-receptor GLP-1 reference with a well-documented acylation pattern and the widest published analytical literature.',
    chooseB:
      'Tirzepatide when the method has to discriminate dual-receptor activity, or when a longer acylated backbone is required as a comparator.',
    faqs: [
      {
        q: 'Are semaglutide and tirzepatide the same class of molecule?',
        a: 'No. Both are incretin-receptor agonists, but semaglutide targets the GLP-1 receptor only, while tirzepatide is a dual GIP/GLP-1 agonist built on a longer backbone.',
      },
      {
        q: 'Why do the two compounds separate differently on RP-HPLC?',
        a: 'Different backbone length, acylation chemistry and hydrophobicity shift retention time; each requires its own reference standard and gradient.',
      },
      {
        q: 'How are these supplied?',
        a: 'As lyophilized powder in 10-vial kits, with lot-specific certificate of analysis. Research use only, not for human or veterinary administration.',
      },
    ],
  },

  {
    pair: 'bpc-157-vs-tb-500',
    a: 'bpc-157',
    b: 'tb-500-thymosin-beta-4-fragment',
    title: 'BPC-157 vs TB-500 — Analytical Comparison | Dchemi',
    description:
      'BPC-157 (15-residue, 1419.5 Da) compared with TB-500, the 7-residue acetylated thymosin β4 fragment (889 Da): sequence, formula, CAS, stability notes and catalogue pricing.',
    lead:
      'BPC-157 is a 15-residue synthetic peptide; TB-500 is the acetylated 7-residue actin-binding fragment of thymosin β4 — an order of magnitude smaller.',
    intro: [
      'The two are frequently grouped in repair-related research catalogues, but they are structurally unrelated. BPC-157 (GEPPPGKPADDAGLV) is a pentadecapeptide derived from a gastric-juice protein fragment and is notable for stability in acidic media. TB-500 is Ac-LKKTETQ, the 17–23 fragment of thymosin β4, kept N-acetylated; its short length makes it easy to over-interpret mass-spec data if the acetyl group is not accounted for.',
      'Analytically, the mass difference is the fastest way to tell them apart: 1419.5 Da versus 889.0 Da. A method validated for one will not transfer to the other without re-optimising the gradient and the MRM transitions.',
    ],
    rows: [
      { label: 'Residue count', a: '15', b: '7' },
      { label: 'Sequence', a: 'GEPPPGKPADDAGLV', b: 'LKKTETQ (N-acetylated)' },
      { label: 'Molecular formula', a: 'C62H98N16O22', b: 'C38H68N10O14' },
      { label: 'Molecular weight', a: '1419.5 Da', b: '889.0 Da' },
      { label: 'CAS number', a: '137525-51-0', b: '885340-08-9' },
      { label: 'Terminal modification', a: 'Free N- and C-terminus', b: 'N-acetyl cap' },
      { label: 'Structural origin', a: 'Gastric-juice protein fragment', b: 'Thymosin β4 (17–23) fragment' },
      { label: 'Catalogue form', a: 'Lyophilized powder, 10-vial kits', b: 'Lyophilized powder, 10-vial kits' },
    ],
    chooseA:
      'BPC-157 when the study design calls for a pentadecapeptide with published stability data in acidic conditions.',
    chooseB:
      'TB-500 when a short, acetylated actin-binding fragment is the intended comparator — and when the assay correctly accounts for the acetyl mass shift.',
    faqs: [
      {
        q: 'Is TB-500 a fragment of BPC-157?',
        a: 'No. TB-500 is a fragment of thymosin β4; BPC-157 derives from a different gastric protein. Their sequences share no meaningful homology.',
      },
      {
        q: 'Why does the acetyl group matter analytically?',
        a: 'Acetylation adds 42.04 Da. Ignoring it shifts the expected mass and can cause misidentification in low-resolution MS workflows.',
      },
      {
        q: 'Do both come with a certificate of analysis?',
        a: 'Yes. Each lot is supplied with purity (RP-HPLC) and identity (ESI-MS) data in the batch-specific COA.',
      },
    ],
  },

  {
    pair: 'ghk-cu-vs-ahk-cu',
    a: 'ghk-cu',
    b: 'ahk-cu',
    title: 'GHK-Cu vs AHK-Cu — Analytical Comparison | Dchemi',
    description:
      'GHK-Cu (Gly-His-Lys copper complex, 403.93 Da) versus AHK-Cu (Ala-His-Lys copper complex, 415.94 Da): tripeptide sequence, formula, CAS, and handling differences.',
    lead:
      'GHK-Cu and AHK-Cu are both copper(II) tripeptide complexes; they differ by a single N-terminal residue — glycine versus alanine — and by 12 Da.',
    intro: [
      'Both are supplied as blue-green copper complexes of a tripeptide with the same His-Lys C-terminal motif. GHK-Cu carries glycine at the N-terminus (Gly-His-Lys), AHK-Cu carries alanine (Ala-His-Lys). The one-carbon difference changes the complex mass from 403.93 to 415.94 Da and shifts the visible absorption slightly, so a spectrophotometric assay calibrated on one will not read correctly on the other.',
      'In the catalogue both are handled as cosmetic-research materials: hygroscopic powders that should be stored dry, protected from light, and reconstituted immediately before use. Copper content is the parameter most worth checking on the COA — a nominal peptide purity does not by itself confirm stoichiometric copper binding.',
    ],
    rows: [
      { label: 'Peptide sequence', a: 'Gly-His-Lys', b: 'Ala-His-Lys' },
      { label: 'Metal', a: 'Cu(II)', b: 'Cu(II)' },
      { label: 'Molecular formula', a: 'C14H24CuN6O4', b: 'C15H24CuN6O4' },
      { label: 'Molecular weight', a: '403.93 Da', b: '415.94 Da' },
      { label: 'CAS number', a: '89030-95-5', b: '300801-03-0' },
      { label: 'Appearance', a: 'Blue-green powder', b: 'Blue-green powder' },
      { label: 'Catalogue form', a: 'Lyophilized powder, 10-vial kits', b: 'Lyophilized powder, 10-vial kits' },
    ],
    chooseA:
      'GHK-Cu when the reference protocol specifies the Gly-His-Lys copper complex, the more widely cited of the two in cosmetic research.',
    chooseB:
      'AHK-Cu when the protocol calls for the alanine analogue, or when a head-to-head comparison of the two tripeptides is the objective.',
    faqs: [
      {
        q: 'Are GHK-Cu and AHK-Cu interchangeable by mass?',
        a: 'No. The 12 Da difference is well above typical LC-MS tolerance, and the complexes also differ in retention behaviour.',
      },
      {
        q: 'What should the COA confirm for a copper peptide?',
        a: 'Peptide purity by RP-HPLC, identity by MS, and copper content — a peptide-only assay does not prove the metal is bound.',
      },
      {
        q: 'How should they be stored?',
        a: 'Dry, protected from light, at -20 °C. Reconstitute immediately before use; avoid repeated freeze–thaw cycles.',
      },
    ],
  },

  {
    pair: 'ipamorelin-vs-ghrp-6',
    a: 'ipamorelin',
    b: 'ghrp-6',
    title: 'Ipamorelin vs GHRP-6 — Analytical Comparison | Dchemi',
    description:
      'Ipamorelin (5 residues, 711.9 Da) versus GHRP-6 (6 residues, 873.0 Da): non-natural residues, amidation, CAS numbers, and why their LC-MS behaviour differs.',
    lead:
      'Ipamorelin is a pentapeptide GH secretagogue with a 2-naphthylalanine residue; GHRP-6 is a hexapeptide built on a different non-natural scaffold.',
    intro: [
      'Both are small synthetic GH-secretagogue peptides containing D-amino acids and a C-terminal amide, which is why they run as compact, hydrophobic peaks on RP-HPLC rather than as typical linear peptides. Ipamorelin (Aib-His-D-2Nal-D-Phe-Lys-NH2) is the shorter and more hydrophobic of the two; GHRP-6 (His-D-Trp-Ala-Trp-D-Phe-Lys-NH2) carries two tryptophan residues, which dominate its UV absorbance at 280 nm.',
      'That tryptophan content is a practical difference for assay design: GHRP-6 can be quantified by A280, while ipamorelin cannot and needs a mass-spectrometric or derivatisation method. Both are supplied as lyophilized powder in 10-vial kits.',
    ],
    rows: [
      { label: 'Residue count', a: '5', b: '6' },
      { label: 'Sequence', a: 'Aib-His-D-2Nal-D-Phe-Lys-NH2', b: 'His-D-Trp-Ala-Trp-D-Phe-Lys-NH2' },
      { label: 'Non-natural residues', a: 'Aib, D-2Nal, D-Phe', b: 'D-Trp, D-Phe' },
      { label: 'C-terminus', a: 'Amide', b: 'Amide' },
      { label: 'Chromophore', a: 'None useful at 280 nm', b: 'Two tryptophans (A280)' },
      { label: 'Molecular formula', a: 'C38H49N9O5', b: 'C46H56N12O6' },
      { label: 'Molecular weight', a: '711.9 Da', b: '873.0 Da' },
      { label: 'CAS number', a: '170851-70-4', b: '145177-42-0' },
    ],
    chooseA:
      'Ipamorelin when a compact, tryptophan-free secretagogue is preferred and quantitation will be done by MS.',
    chooseB:
      'GHRP-6 when UV-based quantitation is convenient and the study design uses the classic hexapeptide comparator.',
    faqs: [
      {
        q: 'Can GHRP-6 be measured by UV absorbance?',
        a: 'Yes — its two tryptophan residues give usable absorbance near 280 nm. Ipamorelin lacks a comparable chromophore.',
      },
      {
        q: 'Why do both peptides carry a C-terminal amide?',
        a: 'Amidation is a common synthetic modification that removes the C-terminal charge and improves stability; it also lowers the mass by ~0.98 Da versus the free acid.',
      },
      {
        q: 'Are these supplied as sterile solutions?',
        a: 'No. Both are lyophilized powders in 10-vial kits and must be reconstituted in the laboratory.',
      },
    ],
  },

  {
    pair: 'selank-vs-semax',
    a: 'selank',
    b: 'semax',
    title: 'Selank vs Semax — Analytical Comparison | Dchemi',
    description:
      'Selank (TKPRPGP, 751.9 Da) versus Semax (MEHFPGP, 813.9 Da): both heptapeptides, different origins, sequences, CAS numbers and assay considerations.',
    lead:
      'Selank and Semax are both heptapeptides, but they are unrelated in sequence: Selank is a tuftsin analogue, Semax an ACTH(4–7) analogue.',
    intro: [
      'Their shared length is misleading. Selank (Thr-Lys-Pro-Arg-Pro-Gly-Pro) is built around the immunopeptide tuftsin motif, while Semax (Met-Glu-His-Phe-Pro-Gly-Pro) extends the ACTH(4–7) core with a Pro-Gly-Pro tail. The two differ in charge distribution and in the presence of methionine, which makes Semax susceptible to oxidation and gives it a characteristic +16 Da oxidised impurity that should be monitored during stability work.',
      'Both are short, hydrophilic peptides that elute early on conventional C18 gradients and are usually resolved on a TFA/acetonitrile system with a shallow gradient. Neither is supplied for human administration.',
    ],
    rows: [
      { label: 'Sequence', a: 'TKPRPGP', b: 'MEHFPGP' },
      { label: 'Structural origin', a: 'Tuftsin analogue', b: 'ACTH(4–7) analogue' },
      { label: 'Molecular formula', a: 'C33H57N11O9', b: 'C37H51N9O10S' },
      { label: 'Molecular weight', a: '751.9 Da', b: '813.9 Da' },
      { label: 'CAS number', a: '129954-34-3', b: '80714-61-0' },
      { label: 'Oxidation risk', a: 'Low', b: 'Methionine — monitor +16 Da' },
      { label: 'Catalogue form', a: 'Lyophilized powder, 10-vial kits', b: 'Lyophilized powder, 10-vial kits' },
    ],
    chooseA:
      'Selank when the study design is anchored on the tuftsin-derived sequence and oxidation is not a primary concern.',
    chooseB:
      'Semax when the ACTH(4–7) analogue is the target — and build the stability protocol around methionine oxidation.',
    faqs: [
      {
        q: 'Do Selank and Semax share a common parent peptide?',
        a: 'No. Selank derives from tuftsin; Semax from the ACTH(4–7) fragment. They share only a Pro-Gly-Pro C-terminal tail.',
      },
      {
        q: 'Why does Semax show a peak 16 Da higher?',
        a: 'Methionine oxidation adds one oxygen (+15.99 Da). It is the most common degradation product to monitor for this sequence.',
      },
      {
        q: 'Are both stable at room temperature?',
        a: 'Store lyophilized powder at -20 °C. Once reconstituted, keep at 2–8 °C and use within the period stated in the batch COA.',
      },
    ],
  },

  {
    pair: 'melanotan-i-vs-melanotan-ii',
    a: 'melanotan-i',
    b: 'melanotan-ii-mt-2',
    title: 'Melanotan I vs Melanotan II — Analytical Comparison | Dchemi',
    description:
      'Melanotan I (afamelanotide, linear 13-residue, 1646.8 Da) versus Melanotan II (cyclic 7-residue lactam, 1024.2 Da): sequence architecture, CAS and handling.',
    lead:
      'Melanotan I is a linear 13-residue α-MSH analogue; Melanotan II is a cyclic 7-residue lactam — different backbone, different molecular weight, different handling.',
    intro: [
      'Melanotan I (afamelanotide) extends the α-MSH core to 13 residues and is N-acetylated and C-amidated. Melanotan II is far shorter but constrained: an N-acetylated heptapeptide cyclised through a lactam bridge between the side chains of Asp and Lys, which locks the molecule into a compact conformation and makes it markedly more lipophilic than its size suggests.',
      'For analytical work the cyclisation is the important detail: linear impurities generated during synthesis or storage will have a different retention time and can be mistaken for a second compound unless the method is developed against both forms. Neither product is intended for human administration.',
    ],
    rows: [
      { label: 'Residue count', a: '13 (linear)', b: '7 (cyclic lactam)' },
      { label: 'Backbone constraint', a: 'None — linear', b: 'Asp–Lys lactam bridge' },
      { label: 'Termini', a: 'N-acetyl, C-amide', b: 'N-acetyl, C-amide' },
      { label: 'Molecular formula', a: 'C78H111N21O19', b: 'C50H69N15O9' },
      { label: 'Molecular weight', a: '1646.8 Da', b: '1024.2 Da' },
      { label: 'CAS number', a: '75921-69-6', b: '121062-08-6' },
      { label: 'Catalogue form', a: 'Lyophilized powder, 10-vial kits', b: 'Lyophilized powder, 10-vial kits' },
    ],
    chooseA:
      'Melanotan I when a linear, fully characterised α-MSH analogue is required for a comparability study.',
    chooseB:
      'Melanotan II when a conformationally constrained, lipophilic analogue is the comparator — plan the method to separate linear isomers.',
    faqs: [
      {
        q: 'Are Melanotan I and II the same molecule at different purities?',
        a: 'No. They differ in length, sequence and backbone constraint, and their masses differ by more than 600 Da.',
      },
      {
        q: 'Why does the lactam bridge matter for chromatography?',
        a: 'Cyclisation changes hydrophobicity and conformation, so linear impurities elute differently and need to be resolved explicitly.',
      },
      {
        q: 'Are these products for cosmetic use?',
        a: 'No. They are sold strictly as research reference materials, not for human or veterinary administration.',
      },
    ],
  },

  {
    pair: 'cjc-1295-vs-sermorelin',
    a: 'cjc-1295-with-dac',
    b: 'sermorelin-acetate',
    title: 'CJC-1295 vs Sermorelin — Analytical Comparison | Dchemi',
    description:
      'CJC-1295 (DAC-conjugated GRF(1-29), 3647.2 Da) versus sermorelin (GRF(1-29), 3357.9 Da): the DAC conjugation, mass shift, CAS numbers and assay implications.',
    lead:
      'Both are built on the GRF(1–29) backbone; CJC-1295 adds a maleimidopropionic acid–DAC conjugate that raises the mass by roughly 289 Da.',
    intro: [
      'Sermorelin is the 29-residue growth-hormone-releasing factor fragment itself. CJC-1295 attaches a maleimidopropionic acid linker carrying a drug-affinity complex (DAC) to the lysine side chain, which is the structural reason the two compounds behave differently in circulation and, more importantly for the laboratory, differ in mass, hydrophobicity and extraction recovery.',
      'On LC-MS the DAC conjugate produces a distinctly later-eluting peak and a higher charge-state envelope; methods transferred from sermorelin without re-optimisation typically lose sensitivity. Both are supplied lyophilized with lot-specific COA and are research-use-only materials.',
    ],
    rows: [
      { label: 'Backbone', a: 'GRF(1–29)', b: 'GRF(1–29)' },
      { label: 'Conjugation', a: 'Maleimidopropionic acid–DAC on Lys', b: 'None' },
      { label: 'Molecular formula', a: 'C165H269N47O46', b: 'C149H246N44O42S' },
      { label: 'Molecular weight', a: '3647.2 Da', b: '3357.9 Da' },
      { label: 'CAS number', a: '446262-90-4', b: '86168-78-7' },
      { label: 'Mass shift vs backbone', a: '+≈289 Da', b: 'Reference backbone' },
      { label: 'Catalogue form', a: 'Lyophilized powder, 10-vial kits', b: 'Lyophilized powder, 10-vial kits' },
    ],
    chooseA:
      'CJC-1295 when the DAC conjugate is the actual analyte — for example when validating extraction recovery of conjugated peptides.',
    chooseB:
      'Sermorelin when the unconjugated GRF(1–29) backbone is the reference material and a simpler analytical target is preferable.',
    faqs: [
      {
        q: 'Is CJC-1295 simply sermorelin with a longer half-life?',
        a: 'Pharmacokinetically the DAC extends circulation time, but structurally it is a different molecule with a different mass and chromatographic behaviour.',
      },
      {
        q: 'Can I use a sermorelin method for CJC-1295?',
        a: 'Not without re-validation. Retention, ionisation efficiency and recovery all change with the DAC conjugate.',
      },
      {
        q: 'Do you supply both as lyophilized powder?',
        a: 'Yes — both are 10-vial kits with batch-specific COA, for laboratory and analytical use only.',
      },
    ],
  },

  {
    pair: 'retatrutide-vs-tirzepatide',
    a: 'retatrutide',
    b: 'tirzepatide',
    title: 'Retatrutide vs Tirzepatide — Analytical Comparison | Dchemi',
    description:
      'Retatrutide (triple GCGR/GIP/GLP-1 agonist, 4731 Da) versus tirzepatide (dual GIP/GLP-1 agonist, 4813 Da): receptor profile, sequence length, CAS and mass differences.',
    lead:
      'Retatrutide and tirzepatide are both 39-residue acylated incretin peptides; retatrutide adds glucagon-receptor activity to the GIP/GLP-1 profile.',
    intro: [
      'The two backbones are close enough in length that mass spectrometry is the practical discriminator: 4731 Da versus 4813 Da, an 82 Da gap that is easy to resolve on a high-resolution instrument but not on a low-resolution single-quadrupole method. Both carry a fatty-acid side chain, which dominates reversed-phase retention and makes the intact molecules strongly hydrophobic.',
      'The distinction that matters for study design is receptor pharmacology: tirzepatide is characterised as a dual GIP/GLP-1 agonist, while retatrutide is described in the literature as a triple agonist that also engages the glucagon receptor. Neither product is supplied for human or veterinary administration.',
    ],
    rows: [
      { label: 'Residue count', a: '39', b: '39' },
      { label: 'Receptor profile', a: 'GCGR / GIP / GLP-1 (triple)', b: 'GIP / GLP-1 (dual)' },
      { label: 'Acylation', a: 'Fatty-acid side chain', b: 'C20 fatty diacid side chain' },
      { label: 'Molecular formula', a: 'C221H342N46O68', b: 'C225H348N48O68' },
      { label: 'Molecular weight', a: '4731 Da', b: '4813 Da' },
      { label: 'Mass difference', a: '−82 Da vs tirzepatide', b: 'Reference' },
      { label: 'CAS number', a: '2381089-83-2', b: '2023788-19-2' },
    ],
    chooseA:
      'Retatrutide when the study requires a triple-agonist reference or when glucagon-receptor engagement is part of the question.',
    chooseB:
      'Tirzepatide when a dual GIP/GLP-1 comparator with a longer published analytical record is preferable.',
    faqs: [
      {
        q: 'Can a low-resolution MS distinguish these two peptides?',
        a: 'The 82 Da difference is resolvable in principle, but the charge-state overlap of two large acylated peptides makes high-resolution MS the safer choice.',
      },
      {
        q: 'Are both supplied with CAS numbers on the COA?',
        a: 'Yes — 2381089-83-2 for retatrutide and 2023788-19-2 for tirzepatide, with purity and identity data per lot.',
      },
      {
        q: 'Do these products come as ready-to-use solutions?',
        a: 'No. Both ship as lyophilized powder in 10-vial kits for laboratory reconstitution.',
      },
    ],
  },
];

export const comparisonByPair = (pair: string) => COMPARISONS.find((c) => c.pair === pair);
