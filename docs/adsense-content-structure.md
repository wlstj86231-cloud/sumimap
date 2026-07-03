# Sumimap AdSense Content Structure

This document is the working gate for the 80% approval pass. Sumimap should read as a Japan daily-life information site with a fast map, not as a map-only tool.

## Publishable Content Types

- Core guide: `/guide/`
- Route hubs: `/routes/`, `/routes/battery/`, `/routes/restroom/`, `/routes/rain/`, `/routes/station/`, `/routes/convenience/`, `/routes/late-night/`, `/routes/first-day/`, `/routes/response/`, `/routes/rest/`, `/routes/korean/`
- City hubs: `/cities/`, `/cities/tokyo/`, `/cities/osaka/`, `/cities/fukuoka/`, `/cities/kyoto/`
- Spot pages: `/spots/*`
- Search-entry articles: root-level daily-life guide pages such as charging, restroom, rain shelter, first-day, and Korean resident pages.

## Required Page Blocks

Every new publishable content page should include:

- A specific situation, not a generic intro.
- A decision standard a visitor can use on the street.
- A short action order.
- One paragraph explaining what not to over-assume.
- At least three internal links to related guides, route hubs, city hubs, or spot pages.
- A clear canonical URL and meta description.
- Inclusion in both `site/sitemap.xml` and `site/feed.xml` when the page is a real reading page.

## Ad Placement Rules

Ads are allowed on:

- `/guide/`
- `/routes/*`
- `/cities/*`
- `/spots/*`
- Root-level static daily-life articles.

Ads must stay off:

- `/`
- `/about/`
- `/editorial/`
- `/policy/`
- `/privacy/`
- `/terms/`
- `/contact/`
- `/review-readiness/`
- Map, report, save, translation, loading, and empty-result states.

## Inventory Command

Run this before and after content expansion:

```bash
npm run content:inventory
```

The command fails on hard issues such as broken internal links, sitemap URLs without local HTML, missing canonical/meta basics, duplicate feed or sitemap URLs, or ad scripts on blocked pages. It reports softer warnings for pages that need more internal links, paragraphs, feed coverage, or ad coverage.
