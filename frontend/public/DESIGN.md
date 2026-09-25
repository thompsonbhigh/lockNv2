---
name: Kinetic Noir
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#f9bd22'
  on-tertiary: '#402d00'
  tertiary-container: '#836100'
  on-tertiary-container: '#ffe2ab'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built for a premium, high-performance fitness or productivity platform. It transitions the raw energy of the reference sketch into a sophisticated, "Pro-tier" digital experience. The brand personality is elite, focused, and high-tech, evoking the feeling of a high-end training facility at night.

The visual direction follows a **Modern Corporate** aesthetic with **Glassmorphic** accents. It utilizes a deep monochromatic base to allow performance data (rankings, points, and stats) to pop with luminous intensity. The goal is to evoke a sense of "prestige through effort," where the interface feels like a precision tool for tracking excellence.

Key characteristics include:
- **Depth:** Layered surfaces to separate global navigation from data-heavy ranking cards.
- **Precision:** Tight alignment and clean sans-serif typography that mirrors technical instruments.
- **Atmosphere:** Subtle radial gradients behind key UI elements to simulate soft stage lighting.

## Colors

The palette is anchored in a "Deep Charcoal" universe. The primary color is **Electric Violet**, used sparingly for high-priority CTAs and achievement highlights. 

- **Primary (Electric Violet):** Used for the "Join Challenge" or "View Profile" actions.
- **Secondary (Cyan):** Used for secondary metrics and data visualization trends.
- **Tertiary (Gold):** Specifically reserved for the "Rank 1" status, honoring the yellow text in the original sketch.
- **Backgrounds:** A strict dark mode hierarchy starting from `#0F172A` (Global Background) to `#1E293B` (Elevated Cards).
- **Gradients:** Subtle linear gradients (15% opacity) may be applied to cards, moving from the primary color to transparent.

## Typography

This design system uses **Inter** for its modern, neutral, and highly legible characteristics. It provides the "high-contrast" feel requested by creating a massive scale difference between display headings and data labels.

- **Display & Headlines:** Set in bold weights with tight letter-spacing to create a "locked-in" feel.
- **Data Labels:** The system introduces **JetBrains Mono** for rank numbers and point values, reinforcing the technical, dashboard-oriented nature of the product.
- **Hierarchy:** Headers should be pure white (`#FFFFFF`), while body text should use a slightly muted off-white (`#94A3B8`) to maintain visual comfort in dark mode.

## Layout & Spacing

The layout utilizes a **12-column Fluid Grid** for desktop and a **1-column stack** for mobile. 

- **Grid Philosophy:** Large gutters (24px) ensure that the ranking cards have room to breathe, preventing the data-heavy layout from feeling cluttered.
- **Vertical Rhythm:** Sections are separated by generous "Section Gaps" (80px+) to emphasize the premium, minimal aesthetic.
- **Content Reflow:** On desktop, the "Workouts," "Tasks," and "Goals" tables sit side-by-side. On tablet, "Workouts" and "Tasks" sit side-by-side with "Goals" spanning the full width below. On mobile, all cards stack vertically with the most relevant metric (Workouts) at the top.

## Elevation & Depth

Depth is created through **Tonal Layering** and **Subtle Blurs** rather than traditional drop shadows.

- **Level 0 (Background):** Solid `#0F172A`.
- **Level 1 (Cards):** Surface color `#1E293B` with a 1px inner border (`#334155`) to define the edge against the dark background.
- **Level 2 (Active/Hover):** Cards increase in brightness slightly, and a subtle "Glow" shadow is added using the primary color at 20% opacity with a 30px blur.
- **Glassmorphism:** Navigation bars and modal overlays use a 12px backdrop blur with a 60% transparent surface color to maintain context of the underlying data.

## Shapes

The design system utilizes **Rounded (0.5rem)** corners to soften the aggressive dark theme, making it feel more like a consumer lifestyle product and less like a terminal.

- **Standard Elements:** Buttons, input fields, and small cards use the base `rounded` (8px) token.
- **Large Containers:** Ranking tables and dashboard widgets use `rounded-lg` (16px).
- **Interactive States:** On hover, clickable cards do not change shape but may show a more defined border-radius through a focused "glow" effect.

## Components

### Buttons
- **Primary:** Solid Electric Violet with white text. High-contrast, no shadow.
- **Ghost:** Transparent background with a 1px border. Used for the "Logout" or secondary actions.

### Ranking Tables (The "Sketch" Modernization)
- Instead of the simple white borders in the sketch, use **Card-Based Lists**.
- Each row in the table is an individual horizontal element with a hover state.
- **The Top Spot:** The #1 rank should have a subtle gradient background or a "Gold" border to signify leadership.

### Points & Badges
- Points are displayed in **JetBrains Mono** for a numeric, precise look.
- Use "Trend" chips (green for up, red for down) next to point values to indicate weekly progress.

### Input Fields
- Dark-themed inputs with a `#334155` border. On focus, the border transitions to the primary color with a subtle outer glow.

### Achievement Cards
- Large, high-impact cards used at the bottom of the landing page to showcase "Hero Workouts" with high-quality photography and a glassmorphic text overlay.