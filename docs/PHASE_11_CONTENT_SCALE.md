# Phase 11 — 100-page content expansion

Status: COMPLETE in source on 25 Aug 2026.

## What changed

Phase 11 expands the site from roughly 50 existing indexable route intents to 100+ unique route intents without creating empty category shells or keyword-swapped duplicates.

A typed registry at `src/content/scaleContent.ts` adds 56 substantive spoke pages across six clusters:

- Rituals: 10 additional pages
- Hajj preparation: 11 additional pages
- Umrah: 11 additional pages
- Tourist Hajj: 10 additional pages
- Makkah & Madinah: 9 pages
- Egypt Hajj / lottery: 5 additional pages

Combined with the pre-existing route inventory, the project now exceeds the 100-page Phase 11 gate.

## Quality rules

Every scaled page has:

- a unique permanent path;
- a unique H1/title and intent;
- a unique introductory summary;
- three substantive sections with page-specific guidance;
- a practical checklist where appropriate;
- a seasonal-vs-evergreen review classification;
- links to adjacent decision steps;
- sibling cluster links for internal-link depth;
- route-specific canonical/title/description through the shared SEO system;
- static prerendering through the production build.

No page is created solely to capture a wording variant. Pages that would require volatile prices, deadlines, visa rules, health requirements, transport limits or government procedures are written as verification/decision guides and marked seasonal rather than freezing unsupported facts.

## Build safeguards

`scripts/content-audit.mjs` now runs before every production build. It blocks the build if:

- scaled paths, titles or intros are duplicated;
- scaled titles/intros fail minimum quality thresholds;
- fewer than 50 scaled pages are present;
- the unique known route-intent inventory falls below 100.

`scripts/prerender.mjs` now reads the scaled registry at build time, prerenders all known route intents, injects route-specific metadata and generates the production sitemap from the canonical route inventory. This prevents the sitemap and prerender list from drifting apart as the content library grows.

## Internal-link model

The global navigation follows the locked architecture:

`الحج في مصر | حج القرعة | الحج السياحي | مناسك الحج | الاستعداد | العمرة | مكة والمدينة | الأدوات`

Scaled pages link to their direct next-action pages and up to six sibling pages from the same cluster. The footer also exposes important cluster entry points.

## Gate

Phase 11 source gate is closed when the automated content audit passes in the production build. Full production/build/visual/indexing verification remains part of Phase 12 final QA.
