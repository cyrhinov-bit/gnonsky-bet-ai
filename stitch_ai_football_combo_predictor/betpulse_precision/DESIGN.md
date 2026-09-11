---
name: BetPulse Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#5700c0'
  on-tertiary: '#ffffff'
  tertiary-container: '#712ae2'
  on-tertiary-container: '#dfccff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-tabular:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-velocity, analytical sports intelligence interface engineered for professional bettors, quantitative analysts, and serious football enthusiasts. The visual narrative balances rigorous statistical authority with live-match urgency. 

The aesthetic is Modern Analytical: crisp, data-dense, and highly legible under rapid decision-making constraints. It rejects typical dark-mode sports betting cliches in favor of an institutional-grade, light-themed Bloomberg-style terminal for football analytics. Micro-interactions are snappy (100–150ms transitions), borders remain hair-thin and structured, and visual hierarchy is driven strictly by semantic data visualization, metric convergence indicators, and sharp typographic discipline.

## Colors

The palette leverages high-energy chromatic anchors mapped directly to data states, supported by an engineered slate neutral foundation.

- **Primary (`#1D4ED8` - Royal Blue):** Anchors operational interactions, primary CTAs, validated predictions, match-winner probabilities, and active navigation nodes.
- **Secondary (`#EA580C` - Athletic Orange):** Signals live market shifts, value bets, edge alerts, momentum peaks, and high-urgency statistical anomalies.
- **Tertiary (`#7C3AED` - Violet):** Reserved exclusively for algorithmic intelligence: proprietary AI model confidence tags, xG/xPTS simulations, machine learning outputs, and model convergence badges.
- **Neutrals & Surfaces:**
  - `Canvas`: `#FFFFFF` (pure white for cards and modules) and `#F8FAFC` (cool slate foundation for canvas backgrounds).
  - `Surfaces & Substrates`: `#F1F5F9` (neutral-100) for structural table rows, inactive states, and nested telemetry blocks.
  - `Borders`: `#E2E8F0` (subtle dividers) and `#CBD5E1` (accent borders on interactive containers).
  - `Typography`: `#0F172A` (deep slate for titles, core odds, primary stats) and `#334155` / `#64748B` for secondary annotations and metadata.

## Typography

The typography pairs **Space Grotesk** (display, headings, odds, tabular data points, labels) with **Hanken Grotesk** (body text, rationales, analytical summaries). 

- Numerical metrics, probabilities, fractional/decimal odds, and algorithmic outputs must always employ tabular lining figures (`font-variant-numeric: tabular-nums`) within Space Grotesk to guarantee vertical alignment across rapid-fire data columns.
- Uppercase tracking is systematically enforced for micro-labels (`label-sm` and `label-md`) at `+0.04em` to `+0.06em` to maintain scanning clarity on compact analytical chips and model indicators.

## Layout & Spacing

The layout is built on a 12-column fluid grid on desktop viewports (`≥ 1280px`), adapting to 8 columns on tablets (`768px–1279px`), and 4 columns on mobile devices (`< 768px`).

- **Grid Architecture:** High informational throughput requires disciplined vertical and horizontal scanning. Modules (such as Match Probability Matrix, Real-time Line Movements, AI Convergences) snap strictly to standard column spans (3, 4, 6, or 12 columns).
- **Layout Rhythm:** Dense analytical tables leverage `space-xs` and `space-sm` for metric cell padding. Structural card perimeters use `space-md` on mobile and `space-lg` on desktop to maintain visual breathing room between competing datasets.
- **Reflow Rules:** Complex side-by-side odds matrices stack into scrollable horizontal sub-panes or vertical accordions below `768px`, while live game score headers pin firmly above analytical detail blocks.

## Elevation & Depth

This design system avoids heavy shadows, maintaining a clean, high-precision technical feel. Depth is established through structural outlines, crisp card boundaries, and controlled ambient diffusion.

- **Flat Substrates:** The application relies primarily on surface layering (`#FFFFFF` resting atop `#F8FAFC` canvas).
- **Outlines (Ghost Borders):** Primary containers utilize a crisp 1px outline (`#E2E8F0`). Highlighting uses full-color borders (e.g., `#1D4ED8` at 40% opacity or `#7C3AED` for algorithmic callouts).
- **Elevation Tiers:**
  - `Level 0 (Flat)`: Tabular data rows, embedded analytical blocks. Border: 1px solid `#E2E8F0`. No shadow.
  - `Level 1 (Default Cards)`: Base metric cards, match tiles. Shadow: `0px 1px 2px rgba(15, 23, 42, 0.04), 0px 1px 3px rgba(15, 23, 42, 0.02)`.
  - `Level 2 (Active/Hover/Floating)`: Active betting slips, highlighted match engines, dropdown menus. Shadow: `0px 4px 6px -1px rgba(15, 23, 42, 0.07), 0px 2px 4px -2px rgba(15, 23, 42, 0.04)`.
  - `Level 3 (Modals/Command Bar)`: Deep dive model simulators. Shadow: `0px 20px 25px -5px rgba(15, 23, 42, 0.08), 0px 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The interface balances sharp precision with modern accessibility by employing a controlled `roundedness: 2` scale:

- Core cards, module boundaries, match tiles, and data visualization panels standardize on `rounded-lg` (1rem / 16px).
- Internal operational controls (buttons, inputs, segmented controls, odds pills) utilize base roundedness (0.5rem / 8px).
- Status tags, micro-badges, and algorithmic confidence metrics retain a slightly more technical, compact contour at 0.375rem (6px) or full circular pills for percentage gauges.

## Components

- **Buttons:**
  - *Primary*: Solid `#1D4ED8` background, `#FFFFFF` Space Grotesk text, 8px radius, crisp micro-transition. Active state scales down to `0.99`.
  - *Urgent/Edge Action*: Solid `#EA580C` background, `#FFFFFF` text. Used for time-sensitive value execution and live alerts.
  - *AI Action*: `#7C3AED` base with subtle `rgba(124, 58, 237, 0.12)` halo on hover.
  - *Secondary/Ghost*: White fill, 1px `#CBD5E1` border, `#0F172A` text. Hover shifts to `#F8FAFC` surface.
- **Odds & Metric Chips:**
  - Tabular layout with two stacked elements: selection name in uppercase `label-sm` (`#64748B`) over bold odds value in Space Grotesk (`#0F172A`).
  - Hover triggers 1px primary royal blue outline. Selected state fills with soft blue tint (`#EFF6FF`) and `#1D4ED8` border.
- **Algorithmic Badges & Confidence Chips:**
  - Background: `rgba(124, 58, 237, 0.08)` (violet tint) with a solid `#7C3AED` 1px border.
  - Text: Uppercase `label-sm` in bold `#7C3AED`. Prefixed with a spark or neural vector micro-icon.
- **Cards & Data Modules:**
  - Pure `#FFFFFF` background with 1px `#E2E8F0` border and `rounded-lg` shape.
  - Card headers feature an integrated top-right telemetry pill showing model convergence or match timeline.
- **Input Fields:**
  - Background `#FFFFFF`, 1px `#CBD5E1` border, 8px radius. Active focus: 1px `#1D4ED8` border accompanied by an ambient `0 0 0 3px rgba(29, 78, 216, 0.15)` focus ring.
- **Specialized Football Components:**
  - *xG Progression Bars*: Dual-colored horizontal stacked bars with rounded ends: `#1D4ED8` (Home) vs. `#EA580C` (Away) over `#F1F5F9` track.
  - *Confidence Radial Gauges*: High-contrast ring diagrams displaying percentage convergence (0–100%) color-coded dynamically (Neutral Slate < 60%, Primary Blue 60–79%, Athletic Orange 80–89%, Algorithmic Purple ≥ 90%).