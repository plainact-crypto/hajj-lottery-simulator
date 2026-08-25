# Phase 8 — Hajj Data Moat

## Purpose
Turn official and verifiable Hajj statistics into a normalized dataset that can support comparisons, charts, tools and future seasonal analysis without presenting historical rates as personal predictions.

## Current coverage
- Egyptian tourist Hajj 1445H / 2024
- Egyptian tourist Hajj 1446H / 2025
- Egyptian tourist Hajj 1447H / 2026

## Normalized fields
Each season stores:
- Hijri and Gregorian season
- market / Hajj pathway
- total applicants
- lottery places only
- per-level applicants
- per-level places
- source name and URL
- source tier
- source date
- notes and limitations

## Calculation rule
Historical selection rate = lottery places / applicants.

This is descriptive historical data only. It is not a personal probability and is not a forecast for the next season.

## Important normalization rule
Do not mix total tourist-Hajj quota with seats actually entered into the lottery. For 1446H / 2025, the published tourist allocation was 36,000, but 5,000 premium places were outside the electronic lottery, so the lottery denominator comparison uses 31,000 places.

## Source hierarchy
1. Official ministry source.
2. Government portal republishing an official ministry statement.
3. Major press only when needed to preserve details absent from an accessible official page.

No missing value is backfilled with an unsupported estimate.

## Expansion gate
Add an older season only after a verifiable source confirms enough fields to avoid misleading comparisons. Add governorate-level or category-level data only when an official or equivalently strong source is available.
