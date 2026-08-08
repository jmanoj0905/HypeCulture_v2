# Design Language: 2025 McLaren Formula 1 Driver — Lando Norris

> Extracted from `https://landonorris.com/` on April 26, 2026
> 1785 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#d2ff00` | rgb(210, 255, 0) | hsl(71, 100%, 50%) | 305 |
| Secondary | `#b2c73a` | rgb(178, 199, 58) | hsl(69, 56%, 50%) | 27 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#f4f4ed` | hsl(60, 24%, 94%) | 1678 |
| `#282c20` | hsl(80, 16%, 15%) | 660 |
| `#535450` | hsl(75, 2%, 32%) | 395 |
| `#111112` | hsl(240, 3%, 7%) | 219 |
| `#dde1d2` | hsl(76, 20%, 85%) | 166 |
| `#b4b8a5` | hsl(73, 12%, 68%) | 133 |
| `#000000` | hsl(0, 0%, 0%) | 76 |
| `#3b3c38` | hsl(75, 3%, 23%) | 27 |
| `#343a26` | hsl(78, 21%, 19%) | 5 |
| `#ffffff` | hsl(0, 0%, 100%) | 1 |

### Background Colors

Used on large-area elements: `#282c20`, `#b2c73a`, `#111112`, `#000000`, `#f4f4ed`

### Text Colors

Text color palette: `#000000`, `#f4f4ed`, `#282c20`, `#111112`, `#2f3327`, `#dde1d2`, `#b4b8a5`, `#d2ff00`, `#535450`, `#b2c73a`

### Gradients

```css
background-image: radial-gradient(circle at 50% -190%, rgba(210, 255, 0, 0) 68%, rgb(210, 255, 0) 83%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#f4f4ed` | text, border, background | 1678 |
| `#282c20` | background, text, border | 660 |
| `#535450` | text, border, background | 395 |
| `#d2ff00` | background, border, text | 305 |
| `#111112` | text, border, background | 219 |
| `#dde1d2` | text, border | 166 |
| `#b4b8a5` | text, border | 133 |
| `#000000` | text, border, background | 76 |
| `#b2c73a` | text, border, background | 27 |
| `#3b3c38` | background | 27 |
| `#343a26` | background | 5 |
| `#ffffff` | background | 1 |

## Typography

### Font Families

- **Mona Sans Variable** — used for all (1707 elements)
- **Brier** — used for all (46 elements)
- **sans-serif** — used for all (32 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 102.4px | 6.4rem | 400 | 20px | normal | div, img, svg, path |
| 97.7778px | 6.1111rem | 700 | 81.1555px | -2.22222px | strong |
| 94.0741px | 5.8796rem | 400 | 84.6667px | -0.740741px | div, span |
| 86.6667px | 5.4167rem | 700 | 70.2px | -2.59259px | h2, span, div |
| 82.963px | 5.1852rem | 700 | 70.5185px | -2.96296px | h2, span, div |
| 64.4444px | 4.0278rem | 700 | 55.1644px | -1.48148px | span |
| 62.2222px | 3.8889rem | 400 | 58.4889px | normal | div, span, h2 |
| 55.5556px | 3.4722rem | 700 | 49.2222px | normal | span |
| 53.3333px | 3.3333rem | 700 | 47.2533px | -1.48148px | h2, span, div |
| 38px | 2.375rem | 700 | 44px | normal | h1 |
| 32.5926px | 2.037rem | 700 | 28.877px | -1.48148px | span |
| 32px | 2rem | 700 | 36px | normal | h2, br, span |
| 31.1111px | 1.9444rem | 400 | 27.5644px | -1.48148px | div, br |
| 23.7037px | 1.4815rem | 400 | 24.6518px | 0.592593px | div, span |
| 22.2222px | 1.3889rem | 800 | 22.2222px | normal | div, span |

### Heading Scale

```css
h2 { font-size: 86.6667px; font-weight: 700; line-height: 70.2px; }
h2 { font-size: 82.963px; font-weight: 700; line-height: 70.5185px; }
h2 { font-size: 62.2222px; font-weight: 400; line-height: 58.4889px; }
h2 { font-size: 53.3333px; font-weight: 700; line-height: 47.2533px; }
h1 { font-size: 38px; font-weight: 700; line-height: 44px; }
h2 { font-size: 32px; font-weight: 700; line-height: 36px; }
h3 { font-size: 10.6667px; font-weight: 600; line-height: 13.3333px; }
```

### Body Text

```css
body { font-size: 11.8519px; font-weight: 400; line-height: normal; }
```

### Font Weights in Use

`400` (1387x), `800` (282x), `700` (99x), `600` (17x)

## Spacing

| Token | Value | Rem |
|-------|-------|-----|
| spacing-3 | 3px | 0.1875rem |
| spacing-21 | 21px | 1.3125rem |
| spacing-44 | 44px | 2.75rem |
| spacing-56 | 56px | 3.5rem |
| spacing-64 | 64px | 4rem |
| spacing-80 | 80px | 5rem |
| spacing-95 | 95px | 5.9375rem |
| spacing-101 | 101px | 6.3125rem |
| spacing-116 | 116px | 7.25rem |
| spacing-130 | 130px | 8.125rem |
| spacing-142 | 142px | 8.875rem |
| spacing-151 | 151px | 9.4375rem |
| spacing-157 | 157px | 9.8125rem |
| spacing-166 | 166px | 10.375rem |
| spacing-342 | 342px | 21.375rem |
| spacing-462 | 462px | 28.875rem |
| spacing-471 | 471px | 29.4375rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 2px | 1 |
| md | 6px | 9 |
| md | 9px | 1 |
| lg | 14px | 2 |
| full | 39px | 7 |

## CSS Custom Properties

### Colors

```css
--color--dark-green: #282c20;
--color--white: #f4f4ed;
--color--black: #111112;
--color--lime-off: #b2c73a;
--color--lime: #d2ff00;
--color--green-off-white-1: #dde1d2;
--color--lime-zero: #d2ff0000;
--text--btn-primary: 1rem;
--color--green-off-white-2: #b4b8a5;
--color--dark-green-tint-2: #535450;
--color--grey-on-track: #b9bbad;
--color--dark-green-tint-1: #3b3c38;
--color--grey-1: #ebeee0;
--color--green-light: #ebeee0;
--color--cream: #efefe5;
--color--grey-2: #c8cbbd;
--color--orange: #ff6b00;
```

### Spacing

```css
--padding--container: 1.25rem;
--gap: 1.25rem;
--on-t-nav-spacer: 5.375rem;
--padding--xlarge: 5rem;
--padding--med: 3rem;
--gap--med<deleted|variable-196f1660-85b7-2eda-5ec8-e43ca0f5032d>: 2rem;
--grid-spacer: 31.51vh;
--padding--small: 2rem;
--padding--mini: 1rem;
--padding--large: 4rem;
--section-padding: calc(3.5rem + (var(--gap) * 2));
--container-padding: 2rem;
```

### Typography

```css
--text--h1: 4rem;
--text--btn-nav: 1.25rem;
--text--btn-footer: 1.875rem;
--text--impact: 7.9375rem;
--text--h2: 4.5rem;
--text--h3: 2rem;
--text--h4: 1.5rem;
--text--h5: 1.2rem;
--text--h6: 1rem;
--text--reg: 1.6rem;
--text--med: 2.76rem;
--text--btn-tertiary: .875px;
--text--eyebrow: .578125rem;
--fluid-font: calc(var(--fluid-container) / var(--design-width) * var(--design-unit) * var(--scale-factor));
```

### Radii

```css
--radius--small: 1rem;
--radius--med: 3rem;
--radius--large: 6.25rem;
```

### Other

```css
--vh: 1vh;
--max-vh: 100vh;
--grid-col: 25.4375rem;
--oval-side-offset: 3rem;
--poduim-offset: -17.5rem;
--cubic-default: cubic-bezier(0.65, 0.05, 0, 1);
--duration-default: 0.75s;
--animation-default: var(--duration-default) var(--cubic-default);
--nav-height: calc(3.75rem (var(--gap) * 2));
--min-width: 992px;
--max-width: 1920px;
--design-width: 1728;
--design-unit: 16;
--scale-factor: 1;
--fluid-container: clamp(var(--min-width), 100vw, var(--max-width));
```

### Dependencies

```css
--animation-default: --duration-default,--cubic-default;
--section-padding: --gap;
--nav-height: --gap;
--fluid-container: --min-width,--max-width;
--fluid-font: --fluid-container,--design-width,--design-unit,--scale-factor;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| sm | 479px | max-width |
| sm | 497px | max-width |
| md | 767px | max-width |
| md | 768px | min-width |
| lg | 991px | max-width |
| lg | 992px | min-width |
| 1920px | 1920px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.75s`, `0.6s`, `0.2s`, `0.3s`, `0.1s`

### Common Transitions

```css
transition: all;
transition: fill 0.75s cubic-bezier(0.65, 0.05, 0, 1);
transition: border-color 0.75s cubic-bezier(0.65, 0.05, 0, 1), background-color 0.75s cubic-bezier(0.65, 0.05, 0, 1);
transition: color 0.75s cubic-bezier(0.65, 0.05, 0, 1);
transition: color 0.6s cubic-bezier(0.19, 1, 0.22, 1);
transition: height 0.2s;
transition: opacity 0.3s;
transition: clip-path 0.75s cubic-bezier(0.65, 0.05, 0, 1);
transition: opacity 0.1s ease-in-out;
transition: opacity 0.75s cubic-bezier(0.65, 0.05, 0, 1);
```

### Keyframe Animations

**spin**
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

**translateXLeft**
```css
@keyframes translateXLeft {
  100% { transform: translateX(-100%); }
}
```

**translateXRight**
```css
@keyframes translateXRight {
  100% { transform: translateX(100%); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (10 instances)

```css
.button {
  background-color: rgb(210, 255, 0);
  color: rgb(40, 44, 32);
  font-size: 14px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 11.8519px;
  border-radius: 6.4px;
}
```

### Cards (15 instances)

```css
.card {
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (38 instances)

```css
.link {
  color: rgb(244, 244, 237);
  font-size: 14px;
  font-weight: 400;
}
```

### Navigation (51 instances)

```css
.navigatio {
  background-color: rgb(210, 255, 0);
  color: rgb(244, 244, 237);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (72 instances)

```css
.foote {
  background-color: rgb(244, 244, 237);
  color: rgb(210, 255, 0);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 102.4px;
}
```

### Modals (48 instances)

```css
.modal {
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Dropdowns (58 instances)

```css
.dropdown {
  background-color: rgb(40, 44, 32);
  border-radius: 0px;
  border-color: rgb(244, 244, 237);
  padding-top: 0px;
}
```

### Badges (38 instances)

```css
.badge {
  color: rgb(244, 244, 237);
  font-size: 10.6667px;
  font-weight: 600;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(17, 17, 18);
  padding: 0px 0px 0px 0px;
  border-radius: 8.77037px;
  border: 0px none rgb(47, 51, 39);
  font-size: 14px;
  font-weight: 400;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(17, 17, 18);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(17, 17, 18);
  font-size: 14px;
  font-weight: 400;
```

### Card — 7 instances, 1 variant

**Variant 1** (7 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(17, 17, 18);
  padding: 0px 0px 0px 0px;
  border-radius: 39.3037px;
  border: 0px none rgb(17, 17, 18);
  font-size: 14px;
  font-weight: 400;
```

### Card — 7 instances, 1 variant

**Variant 1** (7 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(17, 17, 18);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(17, 17, 18);
  font-size: 14px;
  font-weight: 400;
```

## Layout System

**4 grid containers** and **383 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 800px | 0px |
| 1280px | 14.8148px |
| 949.333px | 0px |
| 100% | 0px |
| 948.148px | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 4-column | 4x |

### Grid Templates

```css
grid-template-columns: 301.484px 301.484px 301.484px 301.484px;
gap: 14.8148px;
grid-template-columns: 240.031px 240.031px 240.031px 240.031px;
gap: normal 14.8148px;
grid-template-columns: 294.453px 294.453px 294.453px 294.453px;
gap: normal 14.8148px;
grid-template-columns: 294.453px 294.453px 294.453px 294.453px;
gap: normal 14.8148px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 331x |
| column/nowrap | 52x |

**Gap values:** `14.8148px`, `2.96296px`, `22.2222px`, `23.7037px`, `29.6296px`, `3.7037px`, `44.4444px`, `7.40741px`, `normal 14.8148px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 0 passing, 0 failing color pairs

## Design System Score

**Overall: 82/100 (Grade: B)**

| Category | Score |
|----------|-------|
| Color Discipline | 100/100 |
| Typography Consistency | 70/100 |
| Spacing System | 70/100 |
| Shadow Consistency | 85/100 |
| Border Radius Consistency | 90/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 23 distinct font sizes — consider a tighter type scale
- 67 !important rules — prefer specificity over overrides
- 77% of CSS is unused — consider purging
- 3797 duplicate CSS declarations

## Gradients

**1 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| radial | circle at 50% -190% | 2 | brand |

```css
background: radial-gradient(circle at 50% -190%, rgba(210, 255, 0, 0) 68%, rgb(210, 255, 0) 83%);
```

## Z-Index Map

**13 unique z-index values** across 4 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 9999,99999 | div.t.r.a.n.s.i.t.i.o.n.-.w, div.m.o.b.-.l.a.n.d.s.c.a.p.e.-.b.l.o.c.k |
| dropdown | 120,120 | div.n.a.v |
| sticky | 10,50 | img.m.e.n.u.-.i.m.g.-.t.o.p, img.m.e.n.u.-.i.m.g.-.t.o.p, img.m.e.n.u.-.i.m.g.-.t.o.p |
| base | -1,6 | div.n.a.v.-.m.e.n.u.-.b.g, div.h.o.m.e.-.h.e.r.o.-.n.e.x.t.-.r.a.c.e.-.o.u.t.l.i.n.e. .w.-.e.m.b.e.d, div.h.e.l.m.e.t.-.g.r.i.d.-.e.x.t.e.n.d.e.r |

**Issues:**
- [object Object]

## SVG Icons

**11 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| sm | 1 |
| lg | 2 |
| xl | 8 |

**Icon colors:** `var(--color--grey-2)`, `var(--color--grey-1)`, `currentColor`, `#D2FF00`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| webflow-icons | self-hosted | normal | normal |
| Brier | self-hosted | 700 | normal |
| Mona Sans Variable | self-hosted | 200 900 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| general | 35 | objectFit: cover, borderRadius: 0px, shape: square |
| thumbnail | 15 | objectFit: cover, borderRadius: 0px, shape: square |
| gallery | 4 | objectFit: cover, borderRadius: 0px, shape: square |
| hero | 2 | objectFit: cover, borderRadius: 0px, shape: square |

**Aspect ratios:** 1:1 (27x), 2.04:1 (10x), 9:16 (9x), 4:3 (3x), 3:4 (2x), 21:9 (2x), 2:3 (2x), 16:9 (1x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `100ms` | 100 |
| `sm` | `200ms` | 200 |
| `md` | `300ms` | 300 |
| `lg` | `600ms` | 600 |
| `xl` | `750ms` | 750 |

### Easing Families

- **custom** (101 uses) — `cubic-bezier(0.65, 0.05, 0, 1)`
- **ease-out** (5 uses) — `cubic-bezier(0.19, 1, 0.22, 1)`
- **ease-in-out** (4 uses) — `ease`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `translateXLeft` | slide-x | transform | 1 |

## Component Anatomy

### card — 15 instances

**Slots:** media, footer

## Brand Voice

**Tone:** friendly · **Pronoun:** you-only · **Headings:** Sentence case (tight)

### Sample Headings

> LANDO NORRIS
> 2025 MCLAREN FORMULA 1 DRIVER
> ON

> ON
> TRACK
> ON

> ON
> TRACK
> TRACK
> OFF


## Page Intent

**Type:** `landing` (confidence 0.59)
**Description:** Official hub for British racing star Lando Norris: breaking news, 2025 race wins, exclusive merch, videos and behind-the-scenes access.

Alternates: legal (0.4)

## Section Roles

Reading order (top→bottom): content → hero → content → content → content → content → content → content → content → content → logo-wall → content → cta

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | content | LANDO NORRIS | 0.3 |
| 1 | hero | — | 0.85 |
| 2 | content | — | 0.3 |
| 3 | content | — | 0.3 |
| 4 | content | — | 0.3 |
| 5 | content | ON
 | 0.3 |
| 6 | content | — | 0.3 |
| 7 | content | HELMETS
 | 0.3 |
| 8 | content | — | 0.3 |
| 9 | content | WORLD DRIVERS' CHAMPION | 0.3 |
| 10 | logo-wall | PARTNERS | 0.85 |
| 11 | content | WHAT’S UPON SOCIALS | 0.3 |
| 12 | cta | ALWAYS BRINGING THE FIGHT. | 0.4 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.225 |
| Shadow profile | none |
| Avg shadow blur | 0px |
| Max radius | 39px |
| backdrop-filter in use | no |
| Gradients | 1 |

## Imagery Style

**Label:** `photography` (confidence 0.375)
**Counts:** total 56, svg 13, icon 8, screenshot-like 0, photo-like 40
**Dominant aspect:** square-ish
**Radius profile on images:** square

## Component Screenshots

4 retina crops written to `screenshots/`. Index: `*-screenshots.json`.

| Cluster | Variant | Size (px) | File |
|---------|---------|-----------|------|
| button--default | 0 | 53 × 53 | `screenshots/button-default-0.png` |
| card--default | 0 | 948 × 427 | `screenshots/card-default-0.png` |
| card--default | 1 | 237 × 415 | `screenshots/card-default-1.png` |
| card--default | 2 | 237 × 415 | `screenshots/card-default-2.png` |

Full-page: `screenshots/full-page.png`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Mona Sans Variable` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
