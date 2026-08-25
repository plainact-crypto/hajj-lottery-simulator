# Phase 5 — Glass Design System

Status: implemented on `master`.

## Visual direction

The site uses a cool, restrained glassmorphism system rather than beige/cream luxury styling.

Core palette:
- frosted white / pearl
- cool silver / mist gray
- soft sage
- emerald green accents
- minimal muted gold only where it helps hierarchy

## Core principles

- Glass should feel translucent, not milky or opaque.
- Panels use blur, soft saturation, thin white borders and subtle inner highlights.
- Backgrounds remain cool and luminous; beige-dominant surfaces are avoided.
- Emerald is the primary action and trust color.
- Gold is restrained and secondary.
- Typography remains readable in Arabic/RTL with strong contrast.
- Motion is subtle and preserves `prefers-reduced-motion` support from the base stylesheet.

## Shared components covered

- sticky header/navigation
- mobile navigation panel
- brand mark
- homepage hero
- simulator form
- inputs/selects
- primary/support buttons
- article and pillar cards
- source boxes
- important notes
- formula boxes
- level cards
- result cards
- ritual/quote blocks
- trust/disclaimer/footer surfaces
- trips page inline-styled shell through scoped compatibility overrides

## Templates

The visual system is designed to support four templates as the content architecture grows:
1. Homepage
2. Pillar page
3. Article page
4. Tool page

Current pages inherit the same glass tokens through `src/styles/glass.css`.

## Implementation

Load order:
1. `src/styles/main.css`
2. `src/styles/polish.css`
3. `src/styles/glass.css`

`glass.css` is intentionally the last layer so it can normalize legacy beige surfaces without rewriting working page functionality.

## Accessibility / fallback

- Existing focus-visible behavior remains active.
- Text contrast stays dark emerald/charcoal on light translucent surfaces.
- A non-backdrop-filter fallback converts glass panels to near-opaque pearl surfaces for browsers without blur support.
- Mobile navigation receives a stronger glass background for readability.

## Gate

Phase 5 is considered implementation-complete when the deployed production build loads `glass.css` and representative desktop/mobile pages visually inherit the same system without functional regressions.
