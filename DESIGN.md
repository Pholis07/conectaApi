---
name: conectaApi Pokédex
description: A quiet neutral canvas where each Pokémon's type supplies the only expressive color, with one cobalt tint for actions.
colors:
  tint: "#2B59FF"
  tint-dark: "#7A9BFF"
  on-tint: "#FFFFFF"
  on-tint-dark: "#0E0F12"
  bg: "#F5F5F7"
  bg-dark: "#0E0F12"
  card: "#FFFFFF"
  card-dark: "#1A1C21"
  text: "#111318"
  text-dark: "#F2F3F5"
  sub: "#6B7080"
  sub-dark: "#9A9FAD"
  line: "#E4E5EA"
  line-dark: "#2A2D34"
  track: "#E4E5EA"
  track-dark: "#2A2D34"
  hp-high: "#34C759"
  hp-mid: "#FF9F0A"
  hp-low: "#FF453A"
  type-normal: "#A8A77A"
  type-fire: "#EE8130"
  type-water: "#6390F0"
  type-electric: "#F7D02C"
  type-grass: "#7AC74C"
  type-ice: "#96D9D6"
  type-fighting: "#C22E28"
  type-poison: "#A33EA1"
  type-ground: "#E2BF65"
  type-flying: "#A98FF3"
  type-psychic: "#F95587"
  type-bug: "#A6B91A"
  type-rock: "#B6A136"
  type-ghost: "#735797"
  type-dragon: "#6F35FC"
  type-dark: "#705746"
  type-steel: "#B7B7CE"
  type-fairy: "#D685AD"
typography:
  display:
    fontFamily: "System (SF Pro / Roboto)"
    fontSize: "32px"
    fontWeight: 700
    letterSpacing: "-0.5px"
  title:
    fontFamily: "System (SF Pro / Roboto)"
    fontSize: "22px"
    fontWeight: 700
  body:
    fontFamily: "System (SF Pro / Roboto)"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "24px"
  row-title:
    fontFamily: "System (SF Pro / Roboto)"
    fontSize: "17px"
    fontWeight: 600
  label:
    fontFamily: "System (SF Pro / Roboto)"
    fontSize: "15px"
    fontWeight: 400
  chip:
    fontFamily: "System (SF Pro / Roboto)"
    fontSize: "14px"
    fontWeight: 600
rounded:
  card: "20px"
  row: "16px"
  button: "14px"
  chip: "999px"
  bar: "4px"
  hero-bottom: "32px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.on-tint}"
    rounded: "{rounded.button}"
    height: "52px"
    typography: "{typography.row-title}"
  list-row:
    backgroundColor: "{colors.card}"
    textColor: "{colors.text}"
    rounded: "{rounded.row}"
    height: "72px"
    padding: "0 8px"
  type-chip:
    rounded: "{rounded.chip}"
    padding: "6px 14px"
    typography: "{typography.chip}"
  stats-card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
    padding: "16px"
---

# Design System: conectaApi Pokédex

## Overview

**Creative North Star: "The Quiet Gallery"**

The interface is a neutral, silent wall and each Pokémon is the work hung on it. Surfaces are cool off-white (light) or near-black (dark); the only expressive color on screen is the type color of the Pokémon being shown, and the only brand color is a single cobalt tint reserved for actions. The build rejects the red cartridge Pokédex and illustrated gradient cards, and it carries none of them.

Density is comfortable and thumb-first: 72 pt list rows, 52 pt buttons, 44 pt icon targets. Type is the platform system face on a short, clear scale. Icons are single-stroke Ionicons outline glyphs. Light and dark are both first-class and come from the same token names.

**Key Characteristics:**
- Neutral canvas, grouped rounded cards, no shadows.
- Type color is the only expressive hue; cobalt is the only brand hue.
- System type, weights 400/600/700, tabular numerals for numbers.
- Feedback is immediate: pressed dimming, haptics, animated bars, hit shake.

## Colors

A cool-neutral field with one blue action tint and an eighteen-hue type palette that appears only where a Pokémon is the subject.

### Primary
- **Cobalt Action** (`tint` #2B59FF; dark theme `tint-dark` #7A9BFF): primary buttons, header icon and back tint, spinners, the fallback accent when type is unknown. Text on it is `on-tint` (white in light, near-black in dark).

### Secondary
- **Type Palette** (`type-*` tokens, 18 hues): the Pokémon's first type tints the detail hero wash (accent at 18% alpha, hex suffix `2E`) and the stat bars at full strength; every type gets a solid chip. Chip text color is computed black or white from luminance (threshold 150) so chips keep contrast.

### Neutral
- **Cool Paper** (`bg` #F5F5F7 / `bg-dark` #0E0F12): screen background, header, and the disc behind list sprites.
- **Card White / Card Ink** (`card` #FFFFFF / `card-dark` #1A1C21): list rows, stats card, battle info and log cards.
- **Ink** (`text` #111318 / `text-dark` #F2F3F5): primary text.
- **Quiet Gray** (`sub` #6B7080 / `sub-dark` #9A9FAD): numbers, labels, errors, secondary copy.
- **Track** (`track` #E4E5EA / `track-dark` #2A2D34): empty stat and HP bar tracks. `line` is defined in the theme but unused by any shipped screen.

### Status
- **HP Signal** (`hp-high` #34C759, `hp-mid` #FF9F0A, `hp-low` #FF453A): HP bar fill at above 50%, above 20%, and at or below 20%. Battle-only.

### Named Rules
**The Type-Only Color Rule.** Outside actions and HP status, hue comes from the Pokémon's type and nowhere else. A new surface that needs color derives it from the subject, never invents an accent.

**The One Tint Rule.** Cobalt marks things you can press. It is not decoration and not a second type color.

## Typography

**Display / Body / Label Font:** the platform system face (SF Pro on iOS, Roboto on Android). No custom font is loaded.

**Character:** plain and legible; hierarchy comes from size and weight, not from typeface.

### Hierarchy
- **Display** (700, 32px, -0.5 tracking): Pokémon name on the detail screen. The Pokédex title uses the native iOS large title.
- **Title** (700, 22px): camera permission heading.
- **Body** (400, 17px, 24px line, max 560px): detail description, battle log (centered).
- **Row title** (600, 17px, capitalized): list names, battle names, button labels.
- **Label** (400/600, 15px; 14px for HP count and chips): stat labels and values, dex numbers, error copy.

### Named Rules
**The Tabular Number Rule.** Dex numbers (#001), stat values and HP counts use tabular numerals so columns do not jitter.

## Layout

Single column, one hand. Screens use 16px side padding on the list and battle screens, 20px on the detail body. Vertical rhythm is 8 / 12 / 16 gaps; list rows are 72px tall with an 8px gap (fixed height so `getItemLayout` works). Detail text is capped at 560px for wider devices. Battle stacks opponent then player, centered vertically, with the log card and one full-width button below. Stat rows are label (84px), value (36px, right-aligned), then a flexible bar.

## Elevation & Depth

Flat with tonal layering. There are no shadows anywhere in the build; depth comes from white or ink cards on the Cool Paper field, and from the type-tinted hero wash on the detail screen. The sprite disc in a list row is the page background color set into the card, which reads as a recessed well.

### Named Rules
**The Flat Rule.** Surfaces never cast shadows. If something must separate, change its tone, not its elevation.

## Shapes

Soft, generous, consistent. Cards 20px, rows and battle cards 16px, buttons 14px, chips fully pill (999px), bars 4px on an 8px track. Sprites sit in a 56px circular disc. The detail hero is clipped with 32px bottom corners only, so it reads as a tinted sheet sliding from the header.

## Components

### Buttons
- **Shape:** 14px radius, 52px minimum height, full-width stretch.
- **Primary (the only variant):** cobalt fill, `on-tint` 17px 600 label.
- **States:** pressed and disabled both dim to 55% opacity; hit and selection haptics fire at the call site.

### Chips
- **Style:** solid type color, computed black or white text, 14px 600, 6px by 14px padding, pill. Used for Pokémon types only.

### Cards / Containers
- **Corner Style:** 20px (stats) or 16px (rows, battle info, log).
- **Background:** `card`. **Shadow:** none. **Border:** none. **Padding:** 16px (stats, log), 14px (battle info), 8px horizontal (list row).

### List Row
72px, sprite disc left (56px), capitalized name flexing, dex number right in Quiet Gray. Pressed dims to 60%.

### Stat and HP Bars
8px track, 4px radius. Stat bars fill with the Pokémon's type color proportional to 255 and fade in staggered 50ms per row. HP bars animate scaleX over 450ms and use HP Signal colors.

### Navigation
Native stack, header background equals `bg`, no header shadow, title in Ink, back and action icons in cobalt. The list uses a native large title with a camera icon (Ionicons `camera-outline`, 26px, 44px target) at right.

## Do's and Don'ts

### Do:
- **Do** read every color from `useTheme()` and `TYPE_COLORS`; support light and dark from the same token names.
- **Do** tint detail surfaces from the Pokémon's first type: 18% wash for the hero, full strength for bars.
- **Do** use `onColor()` for text on any type-colored fill.
- **Do** keep touch targets at least 44px and give every pressable an accessibility role and label.
- **Do** use Ionicons outline glyphs and system type.

### Don't:
- **Don't** add shadows or gradients; cards are flat tonal fills.
- **Don't** use cobalt for non-interactive decoration or type colors for actions.
- **Don't** introduce a second brand accent or a red cartridge-style frame.
- **Don't** hardcode neutral hex values in screens; add them to the theme.
