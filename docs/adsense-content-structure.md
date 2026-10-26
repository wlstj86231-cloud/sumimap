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
- The meta block (`metaBlock()` in `scripts/lib/layout.mjs`): 작성·관리 제이 미디어 편집팀 (운영 책임: 대표 이정우), 게시일 (first commit that published the current content), 최종 확인일, number of sources. Then a 범위와 한계 block (`scopeBlock()`) and the 출처 list (`sourcesBlock()`).
- Province pages (`/kr/<slug>/`) carry original analysis counted from the data at build time ("주소 자료에서 읽히는 것") and only those local notes that come from an official page (`scripts/lib/local-notes.mjs`). Provinces whose 시·군 pages were not checked say so instead of getting invented notes.

## Operator and structured data

- Operator facts live in `OPERATOR_INFO` / `ORG` (`scripts/lib/layout.mjs`) and must match boribay.com/about and jnewmedia.com/company/. Every page footer shows 제이 미디어(Media) · 대표 · 사업자등록번호 · 고객센터; sister sites are listed only on `/about/`.
- Every indexable page has the Organization (`@id` https://jnewmedia.com/#organization) and WebSite nodes; pages reference them as author/publisher by `@id`.
- Corrections are logged in the `CHANGELOG` list of `scripts/generate-core-pages.mjs` (shown on `/policy/#changelog`). Add a dated entry for every user-visible fix.

## Ad placement rules

- The AdSense auto-ads loader is allowed only on `/guide/*` article pages. No manual ad slots.
- Every indexable page (not 404/410) carries `<meta name="google-adsense-account" content="ca-pub-5877883031077615">` for ownership verification; the meta tag loads nothing.
- Ads must stay off: `/`, the finder, `/kr/*`, `/about/`, `/sources/`, `/editorial/`, `/policy/`, `/contact/`, `/privacy/`, `/terms/`, `404.html`, the 410 notice, and any empty/loading state.

## Inventory command

```bash
npm run content:inventory
```

Fails on broken internal links, sitemap/feed mismatches, missing canonical/meta, ads on blocked pages, missing official sources, retired Japan routes, old brand names, or near-duplicate pages (7-word shingle Jaccard > 0.34).
