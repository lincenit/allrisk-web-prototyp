---
name: Allrisk.cz Redesign
description: A calm, blue-anchored broker marketing system where one gradient "Line" carries the client's life journey across confident Magistral headlines and generous whitespace.
colors:
  allblue: "#0046C8"
  allblue-hover: "#0039A3"
  allblue-deep: "#072E77"
  alldark: "#002161"
  ink: "#0D1F5B"
  allred: "#BF0D0D"
  success: "#10B981"
  warning: "#F59E0B"
  blue-50: "#E5F1FF"
  blue-100: "#D1E3FA"
  blue-200: "#B4D4FB"
  page: "#F8F9FA"
  surface-card: "#FFFFFF"
  body: "#4B5563"
  ink-subtle: "#6B7280"
  hairline: "#E5E7EB"
  hairline-soft: "#EEF1F5"
  muted: "#6B7280"
  decor-grey: "#9CA3AF"
  footer-navy: "#091633"
# Ramp má deväť stupňov a v kóde žije ako --fs-* v :root (src/index.css).
# Iná veľkosť sa nikde nepíše natvrdo. Názvy nižšie = názvy tokenov.
typography:
  hero:
    fontFamily: "Magistral, Inter, system-ui, sans-serif"
    fontSize: "clamp(36px, 7vw, 68px)"   # --fs-hero, výhradne hero landing page
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Magistral, Inter, system-ui, sans-serif"
    fontSize: "clamp(28px, 4.5vw, 44px)" # --fs-title, h2 sekcií + h1 podstránok
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  band:
    fontFamily: "Magistral, Inter, system-ui, sans-serif"
    fontSize: "clamp(24px, 3.6vw, 34px)" # --fs-h2, nadpis kompaktného pásu/panelu
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  subhead:
    fontFamily: "Magistral, Inter, system-ui, sans-serif"
    fontSize: "clamp(20px, 3vw, 26px)"   # --fs-h3, podnadpis vnútri sekcie
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(16px, 2.3vw, 18px)" # --fs-lead, úvodný odstavec sekcie a hero
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  small:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "14px"                     # --fs-sm, metadáta a kompaktné ovládanie
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  title:
    fontFamily: "Magistral, Inter, system-ui, sans-serif"
    fontSize: "17.5px"                   # --fs-card, titulok karty
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "16px"                     # --fs-body, VŠETKA bežná sadzba vrátane kariet
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  stat:
    fontFamily: "Magistral, Inter, system-ui, sans-serif"
    fontSize: "clamp(19px, 2.2vw, 25px)" # --fs-stat
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"                     # --fs-label
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.15em"
rounded:
  btn: "12px"
  card: "16px"
  band: "24px"
  pill: "9999px"
spacing:
  gutter: "clamp(18px, 5vw, 32px)"
  section: "clamp(44px, 7vw, 84px)"
  header: "64px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.allblue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.btn}"
    padding: "0 28px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.allblue-hover}"
    textColor: "#FFFFFF"
  button-white:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.allblue}"
    rounded: "{rounded.btn}"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.allblue}"
    rounded: "{rounded.btn}"
    height: "48px"
  button-claim:
    backgroundColor: "{colors.allred}"
    textColor: "#FFFFFF"
    rounded: "10px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px 22px"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    height: "54px"
    padding: "0 16px"
  tag:
    backgroundColor: "{colors.blue-50}"
    textColor: "{colors.allblue}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
---

# Design System: Allrisk.cz Redesign

## 1. Overview

**Creative North Star: "The Guided Journey"**

Allrisk is a partner who walks beside the client through every *životní zatáčka* — the turn of a life. The whole system is built around one graphic idea: a single continuous gradient **Line** that represents that journey, laid over calm, confident blue surfaces so the colourful line is always the thing that leads. Everything else — the deep AllBlue field, the Magistral headlines, the generous whitespace — is the quiet ground the journey travels across. This is a broker site that reads as *reassuring authority*: premium and mature, never loud, never a hard sell.

The surface is decisively blue. The signature `blue-gradient` (a left-to-right `#0046C8 → #002366`) carries the header and every hero and promo band; white and near-white `#F8F9FA` carry the reading sections beneath them. Headlines are set in **Magistral** at a light-to-medium weight for a calm, spacious voice; body copy is **Inter** at a comfortable 16px/1.6 in a neutral slate ink. Components are refined and reassuring — soft 12–16px radii, single-hairline borders, a gentle lift on hover, and a blue-tint focus glow. Nothing shouts; trust is earned through clarity, real numbers, and honest contrast.

The system explicitly rejects the site's own dated past — monochrome blue-on-blue boxes, blue body text, stock-photos-in-rounded-frames, weak hierarchy — and it rejects the loud "expressive gradient" and young SaaS/bento looks that would read as too cool and too young for a serious, mature broker. The gradient is a *controlled signature*, not decoration splashed on every block.

**Key Characteristics:**
- One gradient **Line** as the organizing signature; calm blue and white as the ground it travels.
- **Magistral** display (light/medium for calm, bold for emphasis) over **Inter** body — a contrast-by-weight pairing, never two similar sans.
- Deep AllBlue `#0046C8` does the heavy lifting; **AllRed is reserved for one action only**.
- Refined components: 12–16px radii, hairline borders, state-driven lift and glow.
- Neutral slate body ink for reading confidence (targets ≥7:1), never blue-on-blue text.

## 2. Colors

A confident, blue-dominant palette: one corporate blue carries identity across large gradient fields, a neutral slate ramp does all the reading work, and a single red is held in reserve for action.

### Primary
- **AllBlue** (`#0046C8`): the corporate core. Primary buttons, links, active nav, icon strokes, eyebrow accents, stat emphasis, and the starting note of every gradient. This is the brand.
- **AllBlue Hover** (`#0039A3`): the pressed/hover state of primary blue surfaces.
- **AllDark** (`#002161`) / **AllBlue Deep** (`#072E77`): the closing notes of the hero/header gradient and deep-blue fields.
- **Ink** (`#0D1F5B`): a near-navy used for all headings and high-emphasis display text — reads as "serious blue" without being pure black.

### Secondary
- **AllRed** (`#BF0D0D`): the single non-blue focal colour. Used **only** for the "Nahlásit událost" claim action — the one moment a visitor needs urgency. Its rarity is the point.

### Tertiary
- **Success Green** (`#10B981`): covered/insured confirmations, "v pořádku" states, coverage checklists.
- **Warning Amber** (`#F59E0B`): advisory notices, gaps to resolve.
- **Blue-50 / 100 / 200** (`#E5F1FF` / `#D1E3FA` / `#B4D4FB`): soft blue tints for icon chips, aside cards, tags, hover washes, and focus glows.

### Neutral
- **Page** (`#F8F9FA`): the body background beneath white cards and blue bands.
- **Surface Card** (`#FFFFFF`): all cards, panels, inputs, and dropdown surfaces.
- **Body** (`#4B5563`) / **Ink-Subtle** (`#6B7280`): body copy and secondary copy — neutral slate, never blue.
- **Muted** (`#6B7280`): placeholders, captions, node sublabels — the lightest ink allowed to carry *text*. Measures 4.83:1 on white.
- **Decor Grey** (`#9CA3AF`): borders, decorative glyphs, and disabled controls **only**. It measures **2.54:1 on white** and must never be used for text.
- **Hairline** (`#E5E7EB`) / **Hairline-Soft** (`#EEF1F5`): borders, dividers, table rules.
- **Footer Navy** (`#091633`): the near-black-blue footer field.

### Named Rules
**The One Red Rule.** AllRed `#BF0D0D` appears on exactly one thing: the claim/report-event action. It never becomes a generic CTA colour, a heading, or a decorative accent. If two red things share a screen, one of them is wrong.

**The No Blue-Ink Rule.** Body copy is *never* set in blue (`#0046C8` or `#0D1F5B`) — that was the old site's readability failure. Reading text is slate `#4B5563` on white or on `#F8F9FA`, targeting ≥7:1. Blue is for brand and action, not paragraphs.

**The Gradient-Is-The-Line Rule.** The colourful `grad-core` gradient (`#0021E5 → #01C7FF → #8806E4 → #571483`) is the brand's "Line" and appears only as a signature — the 22px lead rule on an eyebrow, the journey's step-progress bar, the animated hero stroke. The footer's top edge used to be on this list; it was dropped 2026-08-04 and the footer now meets the page with no rule at all. The blue-on-blue `grad-blue` is the *field* gradient for headers, heroes, and promo bands. Never swap their jobs.

**The Two-Decorations Rule.** A blue field carries at most two graphic elements, and they are the two the print manual owns: the gradient **Line** and the white hairline **Rings** (see §5). Nothing else gets invented for a blue band — no dot grids, no noise, no floating shapes. White sections carry neither; there the eyebrow and the headline are the brand.

**The Muted-Floor Rule.** `#6B7280` is the floor for any grey that carries text — placeholders and captions included. `#9CA3AF` looks like the natural "quiet" step and reads as elegant in a mockup, but it measures **2.54:1 on white** and fails AA everywhere it has ever been used for copy. If a grey feels too heavy, cut the text or shrink its role; do not lighten it past the floor.

## 3. Typography

**Display Font:** Magistral (with Inter, system-ui fallback)
**Body Font:** Inter (with system-ui, -apple-system fallback)

**Character:** A contrast-by-weight-and-form pairing. Magistral is a distinctive geometric display face carrying brand recognition from the print manual; Inter is a neutral humanist workhorse for interfaces and long reading. They differ enough in form that the pairing reads as intentional hierarchy, not two similar sans competing. Headlines run *light-to-medium* (400–500) for a calm, premium voice and jump to 700–800 only where emphasis or a stat must land.

### Hierarchy
- **Display** (Magistral 500, `clamp(38px, 7vw, 68px)`, line-height 1.04, tracking −0.02em): hero H1 only. Set light so it feels spacious and confident, with `<b>` spans at 700 for the one emphasized phrase. Use `text-wrap: balance`.
- **Headline** (Magistral 500, `clamp(27px, 5.2vw, 40px)`, line-height 1.08): section titles (`.sec-head h2`, promo/hero band headings).
- **Title** (Magistral 700, ~17.5px, line-height 1.3): card headings, accordion questions, FAQ.
- **Body** (Inter 400, 16px, line-height 1.6): all paragraph and UI copy. Cap measure at ~46–56ch (heroes) up to 62ch (section intros); use `text-wrap: pretty` on long prose.
- **Stat** (Magistral 800, `clamp(19px, 2.2vw, 25px)`, up to 40px on results): the big trust numbers (236 000+, 1,5 mld, 300+) and score rings — the one place display goes heavy.
- **Label / Eyebrow** (Inter 700, 12px, tracking 0.15em, uppercase): the signature section kicker, preceded by a 22px `grad-core` rule.

### Named Rules
**The Light-Headline Rule.** Display and headline weights default to 400–500, not 700. Weight is spent deliberately — one bold phrase inside a light H1, or the stat numbers — so heaviness reads as emphasis, not as the baseline. A page of all-bold headlines is the old site.

**The Signature-Kicker Rule.** The uppercase eyebrow is a *brand device*, not per-section scaffolding: it earns its place by carrying the gradient "Line" rule (`.eyebrow::before`), tying every kicker back to the journey graphic. On blue/dark grounds it flips to white or `blue-200` — never stays blue on blue.

## 4. Elevation

Flat by default, with soft blue-tinted shadows that appear as a response to state or to lift a floating band off the page. Depth is conveyed primarily by the single hairline border and the surface/tint contrast (white card on `#F8F9FA` page), not by resting shadows. Shadows are tinted with the brand ink (`rgba(13,31,91,…)`) rather than neutral black, so elevation reads as "brand navy light" rather than grey.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05)`): the barely-there resting shadow on cards and panels. Almost flat.
- **Lift** (`box-shadow: 0 10px 15px -3px rgba(13,31,91,.10), 0 4px 6px -2px rgba(13,31,91,.05)`): the hover state — card rises `translateY(-2px)`, border shifts to AllBlue, shadow deepens in brand navy.
- **Band** (`box-shadow: 0 30px 60px -30px rgba(13,31,91,.5)`): the deep, directional drop under floating gradient promo bands, so they read as a raised object on the page.
- **Focus Glow** (`box-shadow: 0 0 0 3px rgba(0,70,200,.12)`): the 3px blue halo on focused inputs, paired with an AllBlue border and `blue-50` fill.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are near-flat when idle (the Card shadow is almost invisible). Real elevation is a *reaction* — hover lift, focus glow, or a floating band. If a static card has a heavy drop shadow, it's a 2014 app; lighten it.

## 5. Components

### Buttons
- **Shape:** gently rounded (12px, `--r-btn`), 48px tall (40px for `.btn-sm`), 1.5px transparent border reserved for outline variants, `cubic-bezier(.22,1,.36,1)` transitions.
- **Primary:** solid AllBlue on white text (`0 28px` padding, `--btn-px`; `--ctl-px` `22px` for the chrome scale). Hover → `allblue-hover` `#0039A3`.
- **White:** white surface, AllBlue text — the primary CTA *on* blue/gradient grounds. Hover → `blue-50`.
- **Outline:** transparent with AllBlue border and text; hover inverts to solid AllBlue. The secondary action.
- **Ghost-on-dark:** transparent with a translucent-white border for use on gradient heroes; hover inverts to white.
- **Claim (red):** the one AllRed button, 40px, 10px radius, `0 22px` padding — report-an-event only (see The One Red Rule).
- **Icon-only is a square.** Where the label is hidden and only the glyph shows (header search, account), width equals height — the item padding token must not apply, or the button becomes an oblong. Set the width explicitly and zero the inline padding.
- **Arrow-link:** a text-only tertiary — AllBlue, 700 weight, with an arrow that slides 4px right on hover.

### Chips / Tags
- **Style:** fully-rounded pills (`--r-pill`), 12px/600, `5px 12px` padding. Variants: `tag-blue` (solid AllBlue), `tag-soft` (`blue-50` on AllBlue), `tag-green`, `tag-red` — soft tint + matching text, never a coloured left stripe.
- **Segment switch / tabs:** pill or 8–12px buttons, `11px 20–22px` padding; unselected = white with hairline border and slate text, selected = solid AllBlue with white text. Used in the mega-menu "Pro koho" switcher and product-category tabs.

### Section Head
Eyebrow → title → lead is one component (`SecHead`), not a shape retyped per page. The blue page-head on a subpage is the same block with an `h1` instead of an `h2`; only its colours change. Anything below the lead — a stat row, jump links — is passed as children so it inherits the same rhythm.

The eyebrow→title gap is deliberately larger than title→lead. Czech diacritics (`ř`, `í`, `ě`) overshoot the heading's line box at `line-height` 1.04–1.08, so an equal number reads as roughly half the space and the eyebrow appears glued to the accents. The rule is optical, not numeric, and it holds in heroes too.

### Vertical Rhythm
One unit governs the whole page: `--sec-pad` (`spacing.section`). **Every** full-width band — hero, blue page-head, and each content section — carries that exact padding on its top *and* its bottom, so the gap between any two bands is always `2 × --sec-pad`, including across a colour boundary: the white section under a blue hero opens with the same space the hero closed with. No band gets a doubled or halved edge, and no band writes its own value. The two deliberate departures: the philosophy quote takes `2 ×` the unit (a fuller breath, still on the grid), and the footer runs tighter.

A band that slides under the transparent header adds `--hdr-h` on top of its padding — header height is room for the bar, not content spacing, so the content still clears the header by exactly one unit. That padding lives on the band element itself; children (breadcrumb, inner grid) carry only the rhythm *between* their own parts.

### Cards / Containers
- **Corner Style:** 16px (`--r-card`); floating gradient bands go to 24px (`--r-band`).
- **Background:** white `#FFFFFF` on the `#F8F9FA` page; soft-info variants use full `blue-50` fill with a `blue-100` border.
- **Border:** a single 1px hairline `#E5E7EB` — full border, always. **Never** a thick coloured side-stripe.
- **Shadow Strategy:** Card at rest → Lift on hover, with the border shifting to AllBlue and a `translateY(-2px)` rise (see Elevation).
- **Internal Padding:** `20–22px` for content cards, `clamp(20px, 3.5vw, 32px)` for large panels.

### Inputs / Fields
- **Style:** white surface, 1.5px `#E5E7EB` border, 16px radius (`--r-card`), 54px tall, 16px ink text.
- **Focus:** AllBlue border + `blue-50` fill + a 3px `rgba(0,70,200,.12)` glow ring. Calm, unmistakable, no layout shift.
- **Placeholder:** `#6B7280` on white (4.83:1). Required markers use AllRed. Selects carry a custom slate chevron.

### Navigation
- **Header:** sticky, `grad-blue` field, 64px bar, white logo and nav. Nav items are 14.5px/500 translucent-white, hover/active → white on a translucent wash. Three modes: solid gradient (default), transparent-over-hero (fades to solid on scroll), and a light/white variant.
- **Mega-menu ("Produkty"):** a 980px floating panel (18px radius, deep navy shadow) with a 240px category rail, a "Pro koho" segment switcher, and a 2–3 column product grid of icon + title + subtitle items. Escapes the header stacking context via fixed/absolute positioning so it never clips.
- **Mobile:** hamburger → full-height left drawer with segment tabs and an accordion of the same product cards.

### Photo Hero — Photograph under a Blue Gradient
Every hero that carries a photograph (`/vozidla`, `/profil/:slug`, `/kontakt`, branch and advisor details) uses one recipe: the photo stays a photo, and a blue gradient lies over it. The picture has to read as a picture — a duotone that crushes it into flat brand blue was tried and rejected. The homepage video is the reference: you see the scene *and* the blue.

- **Base** — `--hero-base`, a left-to-right `#0046C8 → #0039A3`. Only shows through where there is no photo yet.
- **Photo** — `--hero-photo`, a filter on the source. Default `none`: full colour, untouched. Reach for `saturate()` or `brightness()` only if a specific shot fights the tint.
- **Tint** — `--hero-tint`, the gradient laid over the photo. Its **alpha is the one real knob**: lower shows more photograph, higher shows more blue.
- **Blend** — `--hero-blend`, the tint's blend mode. Default `normal`; `multiply` deepens, `color` pushes toward a true duotone.
- **Markup** — `<section class="hero photo-hero">` + `<div class="photo-hero-bg">`; the mechanism lives in `.photo-hero` (`wireframe.css`), page CSS contributes geometry only. The tint renders on `::before`, because `.phero::after` already carries the brand glows.

**Contrast floor.** The worst case is a white area inside the photo — a highlight, a white laptop — where the tint's alpha is measured against white, not against the photo's average. Over `#0046C8`: alpha `.68` gives 3.9:1 (fails AA for body text), `.75` gives 4.55:1, `.85` gives 5.75:1. The default gradient therefore starts at `.78` on its light end. Large headings only need 3:1, but the paragraph beneath them does not — so check any lower value against a photo with a blown-out highlight, never against a dark one.

### Signature — The Line
The brand's continuous gradient brushstroke, rendered as an inline SVG stroke that *draws* on load (`@keyframes draw` / `shimmer`, stroke-dashoffset animation) and respects `prefers-reduced-motion`. It appears once per composition as a hero/accent — the client's life journey — plus its miniature echoes: the eyebrow lead-rule and the footer's top edge. One line per view; it is never tiled or repeated as texture.

In the prototype the Line arrives as artwork — prepared files in `/public/brand` — never as CSS geometry. Rules that survive whichever file carries it:

- **Every hero and every banner (2026-08-16).** Until that date the rule was one ribbon per page and never over a photo; the client reversed it — the ribbon now sits on heroes exactly like the Rings, photo heroes included. It is still one per *band*, and white sections still get nothing. What made the 2026-08-12 photo test fail was opacity, not the photo: at `.16` over the balloon the stroke read as purple haze, while the artwork at full strength reads as brand.
- **The video hero takes neither decoration.** Tried and dropped twice: the footage carries its own baked-in typography, so a fixed ribbon cuts straight through it, and a hairline over moving frames is a smudge. `/` gets its ribbon from the first flat band instead.
- **It must overflow.** The ribbon is always wider than the band and gets clipped, so no band ever shows the whole shape. Any new blue band therefore needs `overflow: hidden`.

**Placement (2026-08-16).** The artwork and its geometry both come from the live reality site (`allrisk-sites/sites/allrisk-reality`, `src/components/ui/hero-line.tsx`), copied bit-for-bit so the two sites carry the same ribbon rather than two similar ones. `<Line pos>` reproduces it: anchored to the band's **right edge**, natural aspect ratio (`width` + `height:auto`, never `cover`), so it is never stretched or cropped horizontally and overflows vertically instead. Two placements:

| `pos` | Width | Vertical | Responsive |
| --- | --- | --- | --- |
| `hero` | 50 % | centred | `<1280` shifts a quarter right; `<1024` hangs off the top edge |
| `banner` (default) | 75 % | bottom | `≥1024` centres instead |

**No ribbon belongs to a place (2026-08-16).** Four files live in `/public/brand` — `line-1…4.png` — and they are interchangeable: any of the four may stand in any slot. The old `line-hero-*` / `line-banner-*` names claimed a tie between drawing and band type that never existed, so the set was renumbered and the call-site stopped naming a file. `<Line>` picks one itself, and since 2026-08-17 the pick is **re-rolled on every page load** — the client wants the site to look slightly different each time it opens. The same now goes for the Rings: `<Decor>` takes no filename either and rotates through the four canvases. Retired in the same pass: three near-duplicates of the same looping stroke, plus `line-home.png`, which was a knot of three overlapping strokes rather than one gesture. Masters of the whole set stay in `brand-identity/graphics`.

**This is not how the Rings are placed**, which is why the two cannot share a component. Rings are a canvas over the whole band that clips itself; the Line is an object hung on one edge that relies on the band's own `overflow`.

### Signature — The Rings
The second graphic element of the print manual, and the only other decoration allowed on a blue field. A ring is a **concentric pair of 1px white hairlines** — *not* a filled band. The space between the two hairlines stays exactly the ground colour; the "band" is created by the gap alone, and it is about as thick as the Line's ribbon.

Measured from `profilspolecnosti.pdf` p. 9 at 150 dpi:

| Property | Print value |
| --- | --- |
| Stroke | 1px white, alpha ≈ `.11` (≈ `.15` on screen — a 1px hairline fades faster on a monitor than on paper) |
| Radius ratio inner : outer | `0.784` (r 21.8 % and 27.8 % of page width) |
| Band thickness | 6 % of page width ≈ 18 mm, vs. ~14 mm for the Line |
| Diameter | Larger than the frame — arcs, not circles |

Rules, whichever file carries them:

- **Every blue band may take rings; only one gets the Line.** Rings are the quiet default; the ribbon is the accent.
- **Never the whole circle.** Diameters run 30–74 % of the band's width with centres pushed to or past the edges, so what shows is an arc. A ring small enough to close inside the band has failed.
- **Varied opacity is the point.** Each ring carries its own alpha; a set of equally-weighted rings reads as a pattern, which this is not.
- **Blue ground only.** Rings never appear on white or `#F8F9FA` sections.

### Decoration is a file, not code
Neither signature is derived at runtime. A blue band takes **one artwork file** from `/public/brand/decor`, laid over it by `<Decor>` — an `<img>` at `inset: 0`, `object-fit: cover`, **100 % of the band and 100 % opacity**. Which of the four canvases it gets is drawn at random per page load (`src/components/decorPick.js`); only the *choice* is code, never the drawing. The code sets no size, no offset and no alpha: everything visual is baked into the file, so a canvas carrying the rings *and* the ribbon together drops straight in as one layer. The arrangement changes by **replacing a file, never by editing CSS**.

Three consequences when authoring a file:

- **Artboard ratio ≈ band ratio.** `cover` keeps the scale (a circle stays a circle) and crops the surplus, so a canvas far off the band's proportions loses exactly the edges the artwork sits on. Measured on desktop: hero ≈ 3.1–4.1, page head ≈ 3.2–4.6, `.wrap` banner ≈ 4.0, contact band ≈ 2.1.
- **Bake the alpha in.** The `.11–.15` hairline and the ribbon's haze belong in the export, not in a CSS token.
- **Mobile needs no separate file.** On a narrow band `cover` zooms in, which enlarges the arcs on its own.

SVG beats PNG for the rings: `vector-effect="non-scaling-stroke"` holds the stroke at 1px in any width of band, where a scaled PNG goes soft — and the hairline is the whole point. For the ribbon, whose gradient is painterly, PNG is right.

**Status 2026-08-16: both signatures are placed.** Rings sit on **every blue field on the site** — every hero and page head, photo or not, plus the `/o-nas` banners, the banners on `/` and `/blog`, and the shared contact band. Each page carries exactly one ribbon: on the ribbon's own band where the page has one, otherwise on its contact band via `<ContactBand line="…">`.

**Rings go over a photo hero; the ribbon does not.** The photograph and its blue tint stay exactly as they are and the rings are simply one more layer on top — `.decor` sits at `z-index: 1`, after `.photo-hero::before` in the tree, so it paints above the tint and below the type. Nothing about the photo recipe changes. The ribbon is the opposite case: over a photograph it reads as haze rather than as brand (tried on the `/o-nas` balloon hero at `.16`, rejected 2026-08-12), so a photo hero takes rings only and its page's ribbon lives further down. `PageHero` encodes both halves — `<Decor>` unconditionally, `<Line>` only in the `!photo` branch.

**The video hero takes nothing.** The homepage `.wf-hero` is moving footage; a hairline over it would be a smear, and the video is already the page's signature moment.

**Watch for `> *` rules on a band.** `.site .ab-band > *` used to set `position:relative` on every child, which matches `.decor` at equal specificity and — because page CSS loads after `index.css` — silently dropped the canvas back into the flow as an ordinary image. It is now scoped with `:not(.decor):not(.decor-line)`. Any new band rule that styles all children needs the same exclusion.

## 6. Do's and Don'ts

### Do:
- **Do** keep AllBlue `#0046C8` as the identity workhorse — buttons, links, active nav, icon strokes, gradient starts.
- **Do** set body copy in slate `#4B5563` on white or `#F8F9FA`, targeting ≥7:1. Reading confidence is a trust signal.
- **Do** default display and headline weights to 400–500 (Magistral), spending 700–800 only on one emphasized phrase or the stat numbers.
- **Do** use a single 1px hairline border plus surface/tint contrast for structure; let shadows appear only on hover, focus, or floating bands.
- **Do** treat the gradient "Line" as a controlled signature — one per composition, tied to a journey moment, with a reduced-motion fallback.
- **Do** reserve AllRed `#BF0D0D` for the single claim/report action, and pair every colour-coded state (green/amber/red) with an icon or label, not colour alone.

### Don't:
- **Don't** set body text in blue (the old site's mistake) — no blue-on-blue paragraphs, ever.
- **Don't** ship monochrome blue-on-blue boxes or stacked solid-blue rounded rectangles with weak hierarchy.
- **Don't** use a `border-left`/`border-right` greater than 1px as a coloured accent stripe on cards, rows, or callouts — full borders or tinted fills only.
- **Don't** drift into loud "expressive gradient" treatments or young SaaS / bento-grid layouts — too cool and too young for a serious, mature broker.
- **Don't** lean on stock-photos-in-rounded-frames or drop-shadow cards as the aesthetic; nothing brand-distinct lives there.
- **Don't** apply gradient-to-text (`background-clip: text`), decorative glassmorphism as a default, or heavy resting drop-shadows — if a card looks like a 2014 app, the shadow is too dark.
- **Don't** repeat the uppercase eyebrow as empty per-section scaffolding stripped of its gradient-Line rule; the kicker earns its place only as the brand device.
