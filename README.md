# dchemi.com — Site 1 (brand flagship catalogue)

Static Astro site for **Shandong Vicory Biotechnology Co., Ltd.** (山东维科瑞生物科技有限公司).
B2B research-peptide catalogue: 119 products, 266 pack-size SKUs, USD tier pricing per kit of
10 vials, lot-specific COA, RFQ-only ordering, plus **PepPedia** — a research/analytics article
library (9 posts) built for SEO and LLM citation.

- Canonical domain: `https://dchemi.com`
- Hosting: GitHub + Cloudflare (Workers Builds or Pages)
- Output: pure static (`output: 'static'`), zero client framework, Tailwind for styling
- Ordering model: RFQ cart → formatted email / WhatsApp (no card payments, no backend)

---

## 1. Quick start

```bash
# Node 20+ and pnpm (or npm) required
pnpm install

# generate src/data/peptides.json from the master database
pnpm run data

# generate public/llms.txt + public/llms-full.txt
node scripts/gen-llms.mjs

# dev server
pnpm dev            # http://localhost:4321

# production build (runs data + llms generation first)
pnpm build          # → dist/
pnpm preview        # serve dist/ locally
```

The data build reads the governance-layer database:

```
../master_db/master_peptides.json          # default location
MASTER_DB=/path/to/master_peptides.json pnpm run data   # override
```

`src/data/peptides.json` is committed so the site can be built without the master file in CI.

---

## 2. Project structure

```
.
├── astro.config.mjs          # output: 'static', site: https://dchemi.com
├── tailwind.config.mjs       # brand orange #F97316 / brand blue #0284C7
├── postcss.config.mjs
├── tsconfig.json
├── public/
│   ├── _headers              # Cloudflare Pages headers (cache + security + CSP)
│   ├── robots.txt            # canonical host + sitemap + filter-URL disallow
│   ├── favicon.svg
│   ├── llms.txt              # generated (GEO entry point)
│   ├── llms-full.txt         # generated (all 119 products, full parameters)
│   └── images/
│       ├── logo.png          # transparent orange/blue mark
│       └── products/         # drop {slug}.webp here → auto-swaps the placeholder
├── scripts/
│   ├── build-data.mjs        # master_peptides.json → src/data/peptides.json
│   └── gen-llms.mjs          # → public/llms.txt + public/llms-full.txt
└── src/
    ├── content.config.ts     # Astro content collection schema (PepPedia)
    ├── content/peppedia/     # 9 Markdown articles (title, category, FAQ, related SKUs)
    ├── data/peptides.json    # generated catalogue (119 products)
    ├── types/peptide.ts      # data contract
    ├── lib/site.ts           # brand constants, money/abs helpers
    ├── styles/global.css     # Tailwind layers + component classes
    ├── layouts/Layout.astro  # head, Organization/WebSite JSON-LD, header/footer/RFQ drawer
    ├── components/
    │   ├── Header.astro              Footer.astro            Breadcrumbs.astro
    │   ├── ProductCard.astro         PeptideVialPlaceholder.astro
    │   ├── TierTable.astro           CoaPanel.astro
    │   ├── FaqAccordion.astro        RelatedTable.astro
    │   ├── AddToRfqButton.astro      RfqCart.astro           ComplianceNotice.astro
    └── pages/
        ├── index.astro               # brand flagship home
        ├── products.astro            # 119-SKU catalogue (search / filter / sort)
        ├── peptides/[slug].astro     # 119 product pages (getStaticPaths)
        ├── quality-coa.astro         # QC system, lot lookup, COA request
        ├── about-compliance.astro    # company, supply chain, US compliance
        ├── rfq.astro                 # full RFQ form
        ├── peppedia/index.astro      # PepPedia library (topic filter)
        ├── peppedia/[slug].astro     # article page (TOC, FAQ, related SKUs)
        ├── sitemap.xml.ts            # absolute-path sitemap at build time
        └── 404.astro
```

---

## 3. Data contract (`src/data/peptides.json`)

```jsonc
{
  "productCount": 119,
  "categories": [{ "key": "glp1_metabolic", "label": "…", "count": 16 }],
  "products": [{
    "slug": "bpc-157",
    "name": "BPC-157",
    "shortCode": "BC",
    "cas": null,                 // null = published in batch COA only
    "sequence": null,
    "purity": "≥99.0% (HPLC)",
    "form": "lyophilized_powder",
    "kitVials": 10,
    "specs": [{
      "spec": "5mg*10vials",
      "label": "5 mg",
      "vials": 10,
      "perKit": 17.76,
      "tiers": [
        { "min": 1,  "max": 9,    "price": 17.76, "label": "1–9 Kits" },
        { "min": 10, "max": 49,   "price": 16.34, "label": "10–49 Kits" },
        { "min": 50, "max": null, "price": 15.10, "label": "50+ Kits" }
      ]
    }],
    "coa": { "lotFormat": "VC-2026-BC-01", "method": "RP-HPLC · ESI-MS", "…": "…" },
    "imageUrl": null,            // set to /images/products/{slug}.webp when available
    "coaPdfUrl": null            // set to /coa/{slug}.pdf when available
  }]
}
```

**Chemistry fields are never invented.** The source workbook has no CAS / sequence / molecular
weight columns, so those fields are `null` and every page states “published in the batch COA”.
When the chemistry reference is filled in the governance layer, `scripts/build-data.mjs` picks the
values up automatically and the UI switches to “Chemistry documented”.

---

## 4. Switching placeholders to real assets

| Placeholder | Replace with | Effect |
|---|---|---|
| `PeptideVialPlaceholder` SVG | `public/images/products/{slug}.webp` | Product page and cards use the real photo automatically (build-time `fs.existsSync` check) |
| “Request official batch PDF COA” | `public/coa/{slug}.pdf` + set `coaPdfUrl` in `build-data.mjs` | Button becomes “Download Official COA PDF” |
| Simulated chromatogram | Real HPLC trace in the COA PDF | Keep the panel as a summary, link the PDF |

COA batch pattern used across the site: `VC-2026-[SHORT_CODE]-01`.

---

## 5. SEO / GEO checklist (already wired)

- `Organization` + `WebSite` JSON-LD on every page (legal name, logo, email, phone, address, `sameAs` WhatsApp).
- Product pages: `Product` + `AggregateOffer` (USD, 1–9 / 10–49 / 50+ tiers) + `FAQPage` + `BreadcrumbList`.
- `ItemList` on `/products`, `FAQPage` on `/` and `/quality-coa`.
- Absolute canonical URLs, OG/Twitter cards, `sitemap.xml` generated at build with `https://dchemi.com`.
- `robots.txt` blocks `?category=` / `?q=` duplicates; sitemap declared.
- `_headers`: HSTS, CSP, `X-Content-Type-Options`, immutable caching for `/_astro/*`, long cache for `/images/*`.
- `public/llms.txt` (navigation) and `public/llms-full.txt` (full dataset, ~255 KB Markdown) for LLM crawlers.

---

## 6. Deploy to Cloudflare

The repo ships **wrangler.jsonc** (assets-only Worker), so either Cloudflare product works
without extra configuration.

### Option A - Workers Builds (icory01)

| Setting | Value |
|---|---|
| Build command | pnpm run build |
| Deploy command | 
px wrangler deploy |
| Root directory | / |
| Node | 20+ (NODE_VERSION=20) |
| pnpm | 9.10.0 (pinned via packageManager) |

wrangler.jsonc maps the Worker to ./dist, uses html_handling: drop-trailing-slash
(matches Astro 	railingSlash: 'never') and 
ot_found_handling: 404-page (dist/404.html).

> CI note: scripts/build-data.mjs **skips regeneration** when ../master_db/master_peptides.json
> is absent and falls back to the committed src/data/peptides.json. Keep that file committed.

### Option B - Cloudflare Pages

- Framework preset: **Astro**, build command pnpm build, output directory dist.
- public/_headers is applied automatically on Pages. On a Worker, mirror the same headers via
  wrangler.jsonc -> ssets.headers if you need them.

### Domain + indexing (both options)

1. Custom domain: dchemi.com (and www.dchemi.com).
2. Add a **Redirect Rule** so mirrors never get indexed:
   host eq "www.dchemi.com" -> 301 -> concat("https://dchemi.com", http.request.uri.path);
   also redirect the *.workers.dev / *.pages.dev preview host to the canonical domain.
3. After the first deploy: submit https://dchemi.com/sitemap.xml in Google Search Console and Bing
   Webmaster Tools; verify 
obots.txt and llms.txt resolve.

---

## 7. Compliance guardrails baked into the build

- Footer, product pages and the RFQ drawer all render
  **“For Research, Laboratory, and Analytical Use Only. Not for Human or Veterinary Use.”**
- No dosing, therapeutic, diagnostic or outcome claims anywhere in generated copy.
- No online payment, no checkout, no card data collection — RFQ → proforma invoice.
- Trademarked medicine brand names are deliberately excluded from product aliases and
  `alternateName` structured data.
- `No statement on this site has been evaluated by the FDA.` on the compliance page.

---

## 8. Content maintenance

| Task | Where |
|---|---|
| Add / edit a product | governance layer (`master_peptides.json`) → `pnpm run data` |
| Change pricing tiers | `TIER_POLICY` in the governance layer |
| Change the site-wide price multiplier | `PRICE_MULTIPLIER` in `scripts/build-data.mjs` (default `2`; override with `PRICE_MULTIPLIER=1.5 pnpm run data`). The governance DB keeps reference prices; the site sells at reference × multiplier, and every SKU price, tier, `perVial`, JSON-LD offer and llms file is derived from it. |
| Change brand info | `src/lib/site.ts` |
| Change colours | `tailwind.config.mjs` |
| Add a page | `src/pages/*.astro` (auto-routed, statically built) |
