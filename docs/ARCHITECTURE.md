# Hajj Site — Final Information Architecture

Status: **Phase 2 locked**
Date: 2026-08-25

## Architecture principle

The site is organized around the pilgrim journey and search intent, not around product features.

Primary journey:

`understand options → determine eligibility → apply → track dates/results → choose services/program → prepare → travel → perform rituals → resolve issues`

## Primary navigation

Keep the main navigation intentionally small:

1. الحج في مصر — `/egypt-hajj/`
2. حج القرعة — `/hajj-lottery/`
3. الحج السياحي — `/tourist-hajj/`
4. مناسك الحج — `/hajj-rituals/`
5. الاستعداد للحج — `/hajj-preparation/`
6. العمرة — `/umrah/`
7. مكة والمدينة — `/makkah-madinah/`
8. الأدوات — `/tools/`

Trust/legal pages belong in the footer, not the primary navigation.

## Final URL tree

```text
/
├── egypt-hajj/
│   ├── 2027/
│   ├── compare-options/
│   ├── unified-portal/
│   ├── documents/
│   └── associations/
│       └── 2027/
│
├── hajj-lottery/
│   ├── how-it-works/
│   ├── statistics/
│   ├── probability/
│   └── 2027/
│       ├── requirements/
│       ├── apply/
│       ├── dates-results/
│       └── after-winning/
│
├── tourist-hajj/
│   ├── levels/
│   ├── companies/
│   ├── choose-program/
│   ├── economic/
│   ├── land/
│   ├── five-star/
│   └── 2027/
│       ├── requirements/
│       ├── lottery/
│       └── prices/
│
├── hajj-rituals/
│   ├── step-by-step/
│   ├── types/
│   ├── pillars-obligations/
│   ├── ihram/
│   ├── miqat-egypt/
│   ├── tawaf/
│   ├── sai/
│   ├── tarwiyah/
│   ├── arafah/
│   ├── muzdalifah/
│   ├── stoning/
│   ├── halq-taqsir/
│   ├── tawaf-al-ifadah/
│   ├── tashreeq/
│   ├── farewell-tawaf/
│   ├── common-mistakes/
│   ├── duas/
│   └── timeline/
│
├── hajj-preparation/
│   ├── first-time/
│   ├── packing-list/
│   ├── packing-men/
│   ├── packing-women/
│   ├── clothes-shoes/
│   ├── health/
│   ├── medications/
│   ├── heat/
│   ├── elderly/
│   ├── women/
│   ├── accessibility/
│   ├── money/
│   ├── apps-connectivity/
│   ├── nusuk/
│   └── lost-documents/
│
├── umrah/
│   ├── egypt/
│   ├── visa/
│   ├── requirements/
│   ├── programs/
│   ├── prices/
│   ├── companies/
│   ├── economy/
│   ├── five-star/
│   ├── ramadan/
│   ├── best-time/
│   ├── rituals/
│   ├── packing-list/
│   └── timeline/
│
├── makkah-madinah/
│   ├── egypt-flight-journey/
│   ├── jeddah-to-makkah/
│   ├── makkah-areas/
│   ├── makkah-hotels/
│   ├── hotel-distance/
│   ├── makkah-transport/
│   ├── haramain-train/
│   ├── makkah-to-madinah/
│   ├── madinah/
│   └── rawdah/
│
├── tools/
│   ├── hajj-lottery-simulator/
│   ├── hajj-eligibility/
│   ├── hajj-budget-calculator/
│   ├── hajj-program-comparison/
│   ├── hajj-packing-checklist/
│   ├── hajj-ritual-checklist/
│   ├── hajj-timeline/
│   ├── hajj-type-selector/
│   ├── hotel-haram-distance/
│   └── umrah-program-checker/
│
├── data/
│   └── hajj-lottery-statistics/
│
├── sources/
├── guides/
├── about/
├── contact/
├── authors/
├── editorial-policy/
├── sources-policy/
├── corrections-policy/
├── privacy/
├── disclaimer/
└── affiliate-disclosure/   # only when applicable
```

## Current-to-final URL migration map

| Current URL | Final canonical URL | Treatment | Notes |
|---|---|---|---|
| `/` | `/` | KEEP | Homepage remains a discovery/decision gateway and may embed the simulator |
| `/how-it-works` | `/hajj-lottery/how-it-works/` | 301 after target exists | Expanded methodology page |
| `/hajj-levels` | `/tourist-hajj/levels/` | 301 after target exists | Rebuilt as tourism-Hajj decision pillar |
| `/rituals` | `/hajj-rituals/` | 301 after target exists | Becomes full ritual pillar |
| `/hajj-systems-world` | no immediate replacement | REMOVE FROM PRIMARY NAV | Keep legacy URL temporarily; later country hubs replace broad world page |
| `/articles-sources` | `/sources/` | 301 after target exists | Becomes source directory + source policy gateway |
| `/guides` | `/guides/` | KEEP | Editorial discovery page; cluster pages should live under topical silos |
| `/guides/:slug` | topic-specific permanent URL | MIGRATE ARTICLE-BY-ARTICLE | No bulk redirect until each article has a canonical topic owner |
| `/umrah-1448-checker` | `/tools/umrah-program-checker/` | 301 after target exists | Tool gains indexable methodology/landing content |
| `/trips` | `/tools/hajj-program-comparison/` eventually | DO NOT REDIRECT YET | Semantics are not equivalent until comparator is built |
| `/about` | `/about/` | KEEP | Trust page |
| `/privacy` | `/privacy/` | KEEP | Legal/trust |
| `/disclaimer` | `/disclaimer/` | KEEP | Strengthen later |

## Pillar ownership rules

Every indexable content page must have exactly one primary topical owner:

- Egypt application/process content → `/egypt-hajj/`
- Interior lottery process/data → `/hajj-lottery/`
- Tourism program/company/pricing content → `/tourist-hajj/`
- Religious ritual sequence → `/hajj-rituals/`
- Preparation and practical readiness → `/hajj-preparation/`
- Umrah → `/umrah/`
- Destination logistics → `/makkah-madinah/`
- Interactive experiences → `/tools/`
- Original normalized datasets → `/data/`

Do not create a second page targeting the same primary user intent unless there is a strong operational distinction.

## Internal-link rule

Every supporting page must:

1. link upward to one parent pillar;
2. link laterally to 1–2 genuinely related sibling pages;
3. link to one useful tool where relevant;
4. link to primary official sources for time-sensitive rules;
5. avoid orphan pages.

Examples:

`شروط حج القرعة → حج القرعة 2027 → eligibility checker → طريقة التقديم`

`مستويات الحج السياحي → اختيار برنامج الحج → program comparison tool`

`شنطة الحج → preparation pillar → interactive packing checklist`

## Navigation rules

### Main navigation

`الحج في مصر | حج القرعة | الحج السياحي | مناسك الحج | الاستعداد | العمرة | مكة والمدينة | الأدوات`

### Footer/trust navigation

`عن الموقع | فريق التحرير | سياسة التحرير | سياسة المصادر | التصحيحات | تواصل معنا | الخصوصية | إخلاء المسؤولية | المصادر الرسمية`

## Indexation rules

- Do not publish empty category shells simply to reserve URLs.
- A route becomes indexable only when it has substantive user value.
- Seasonal pages must display last-reviewed date and source date.
- Tool pages require explanatory/indexable content, methodology, limitations and next-action links.
- Thin tag/search/filter pages are not part of the indexable architecture.

## Phase 2 gate

Phase 2 is complete when:

- final topical silos are locked;
- permanent URL ownership is defined;
- current-route migration treatment is defined;
- main/footer navigation roles are defined;
- no new page may be created outside this architecture without an explicit architecture update.

The redirect/canonical/SSR implementation itself belongs to Phase 3 (Technical SEO).