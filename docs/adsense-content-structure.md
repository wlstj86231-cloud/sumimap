# 영농폐기물 집하장 지도: content and ad placement rules

The site is a farm waste collection point finder with source-backed disposal guides. (The former Japan daily-life map was retired on 2026-10-26; its URLs answer 410 from `functions/_middleware.js`.)

## Publishable content types

- Finder tool: `/kr/farm-waste-collection/`
- Province directory: `/kr/` and `/kr/<slug>/` (provinces with 20+ rows)
- Disposal guides: `/guide/`, `/guide/vinyl/`, `/guide/pesticide-containers/`, `/guide/leftover-pesticide/`, `/guide/other-farm-waste/`, `/guide/before-visit/`, `/guide/no-burning/`

## Required page blocks

Every content page needs:

- A specific job (find an address, or answer one disposal question) and a link into the finder.
- Facts only from official sources (한국환경공단, 농림축산식품부, 지자체, 국가법령정보센터), linked with 자료 대조일. Regional rules are labelled with the region.
- At least two direct official links, the words "공식 원문" and "자료 대조일" (checked by `npm run content:inventory`).
- Unique title/description, canonical URL, JSON-LD that matches the visible content, and inclusion in `sitemap.xml` and `feed.xml`.

## Ad placement rules

- The AdSense auto-ads loader is allowed only on `/guide/*` article pages. No manual ad slots.
- Ads must stay off: `/`, the finder, `/kr/*`, `/about/`, `/sources/`, `/editorial/`, `/policy/`, `/contact/`, `/privacy/`, `/terms/`, `404.html`, the 410 notice, and any empty/loading state.

## Inventory command

```bash
npm run content:inventory
```

Fails on broken internal links, sitemap/feed mismatches, missing canonical/meta, ads on blocked pages, missing official sources, retired Japan routes, old brand names, or near-duplicate pages (7-word shingle Jaccard > 0.34).
