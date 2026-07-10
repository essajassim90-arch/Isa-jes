# NAMA Design System

## Executive Design Summary

**Version:** 1.0  
**Status:** Approved — Design Foundation  
**Project:** NAMA — Global Trust Infrastructure for Sustainable Food Systems

---

## Design Philosophy

NAMA is positioned as **"Global Trust Infrastructure for Sustainable Food Systems"** — not a blockchain marketplace, not a trading terminal, and not a consumer app. Every design decision must reinforce this positioning.

### Core Design Principles

| Principle | Definition |
|-----------|-----------|
| **Verifiable Trust** | Every interaction must communicate data integrity and immutability |
| **Enterprise Reliability** | Interfaces must feel as solid and dependable as SAP or Stripe |
| **Sustainability First** | Visual language must reflect environmental purpose |
| **Transparent Clarity** | Complex supply chain data must be readable at a glance |
| **Inclusive Access** | WCAG 2.2 AA compliance is non-negotiable |

### Target Audience Profile

| Stakeholder | Primary Need | Design Priority |
|-------------|-------------|----------------|
| Enterprise Procurement Officers | Efficiency, compliance proof | Clean tables, clear CTAs |
| Sustainability Auditors | ESG data verification | Data-dense dashboards, exportable |
| Regulatory Inspectors | Traceability, immutability | Audit trails, blockchain indicators |
| Logistics Operators | Real-time status, alerts | Status badges, maps, alerts |
| Food Producers (SME) | Simple onboarding, trust | Guided flows, verification states |
| Institutional Buyers | Supplier trust signals | Verified badges, comparison tools |

---

## Visual Inspiration

| Reference | Applicable Pattern |
|-----------|--------------------|
| **SAP Fiori** | Information density, structured data, business process flows |
| **Stripe Dashboard** | Clean typography, status indicators, excellent empty states |
| **Notion** | Document-first clarity, progressive disclosure |
| **Linear** | Fast, precise, micro-interactions |
| **Enterprise Sustainability Platforms** | ESG metric displays, carbon dashboards |

### What to Avoid

- Crypto trading dashboards (candlestick charts, neon colors, token price tickers)
- Meme or consumer coin aesthetic
- NFT marketplace grid layouts as primary UI
- Dark mode heavy with fluorescent accent colors
- Excessive animation or motion

---

## Brand System

### Typography

**Primary Font:** Inter (Google Fonts / self-hosted)

| Scale | Name | Size | Weight | Line Height | Usage |
|-------|------|------|--------|-------------|-------|
| `--text-xs` | Caption | 12px | 400 | 1.5 | Labels, metadata, footnotes |
| `--text-sm` | Small | 14px | 400/500 | 1.5 | Secondary content, table cells |
| `--text-base` | Body | 16px | 400 | 1.6 | Primary body text |
| `--text-lg` | Body Large | 18px | 400/500 | 1.6 | Introductory paragraphs |
| `--text-xl` | Heading 4 | 20px | 600 | 1.4 | Section subheadings |
| `--text-2xl` | Heading 3 | 24px | 600 | 1.3 | Card headers, module titles |
| `--text-3xl` | Heading 2 | 30px | 700 | 1.2 | Page headings |
| `--text-4xl` | Heading 1 | 36px | 700 | 1.15 | Hero headings |
| `--text-5xl` | Display | 48px | 800 | 1.1 | Landing page hero |

### Color System

NAMA uses a semantic color architecture. The VeChain-inspired purple is **strictly reserved** for blockchain verification events.

#### Semantic Color Groups

**Brand Greens — Primary Palette (Sustainability, Trust, Growth)**

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--color-green-950` | `#052E16` | Deep Forest | Text on light backgrounds, strong emphasis |
| `--color-green-900` | `#14532D` | Deep Green | Primary brand, major headings |
| `--color-green-700` | `#15803D` | Forest Green | Primary interactive elements |
| `--color-green-600` | `#16A34A` | Fresh Green | Buttons, links, active states |
| `--color-green-500` | `#22C55E` | Leaf Green | Icons, success indicators |
| `--color-green-400` | `#4ADE80` | Light Green | Hover states, soft accents |
| `--color-green-100` | `#DCFCE7` | Mint Tint | Card backgrounds, subtle fills |
| `--color-green-50` | `#F0FDF4` | Fresh White | Page background tints |

**Neutrals — Structural Palette**

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--color-navy-950` | `#0A0F1E` | Deep Navy | Primary text, headings |
| `--color-navy-900` | `#0F172A` | Dark Navy | Sidebar backgrounds, footer |
| `--color-navy-800` | `#1E293B` | Navy | Navigation, secondary backgrounds |
| `--color-navy-700` | `#334155` | Slate Navy | Tertiary text |
| `--color-gray-600` | `#475569` | Cool Gray | Secondary text |
| `--color-gray-400` | `#94A3B8` | Medium Gray | Placeholder text, borders |
| `--color-gray-200` | `#E2E8F0` | Light Gray | Dividers, input borders |
| `--color-gray-100` | `#F1F5F9` | Soft Gray | Card backgrounds, alternating rows |
| `--color-gray-50` | `#F8FAFC` | Off White | Page background |
| `--color-white` | `#FFFFFF` | Clean White | Card surfaces, modal backgrounds |

**VeChain Purple — Blockchain Verification ONLY**

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--color-vechain-700` | `#5B21B6` | Deep Purple | Verified DPP headers (dark) |
| `--color-vechain-600` | `#7C3AED` | VeChain Purple | Primary blockchain indicators |
| `--color-vechain-500` | `#8B5CF6` | Trust Purple | Smart contract success states |
| `--color-vechain-400` | `#A78BFA` | Light Purple | Verification icon accents |
| `--color-vechain-100` | `#EDE9FE` | Lavender Tint | Verified badge background |
| `--color-vechain-50` | `#F5F3FF` | Soft Lavender | Blockchain verified card tint |

**Semantic State Colors**

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#16A34A` | Confirmed, active, verified |
| `--color-warning` | `#D97706` | Alerts, cautions, expiring soon |
| `--color-error` | `#DC2626` | Failures, critical alerts |
| `--color-info` | `#0284C7` | Informational notices |

---

## Design Tokens — Production CSS Variables

```css
/* =============================================================
   NAMA DESIGN SYSTEM — CSS Custom Properties
   Version: 1.0
   ============================================================= */

:root {

  /* ─── TYPOGRAPHY ─── */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
  --text-5xl:  3rem;      /* 48px */

  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
  --font-extrabold:800;

  --leading-tight:  1.15;
  --leading-snug:   1.25;
  --leading-normal: 1.5;
  --leading-relaxed:1.6;
  --leading-loose:  1.75;

  --tracking-tight:  -0.025em;
  --tracking-normal:  0em;
  --tracking-wide:    0.025em;
  --tracking-wider:   0.05em;
  --tracking-widest:  0.1em;

  /* ─── BRAND GREENS ─── */
  --color-green-950: #052E16;
  --color-green-900: #14532D;
  --color-green-700: #15803D;
  --color-green-600: #16A34A;
  --color-green-500: #22C55E;
  --color-green-400: #4ADE80;
  --color-green-200: #BBF7D0;
  --color-green-100: #DCFCE7;
  --color-green-50:  #F0FDF4;

  /* ─── NAVY & NEUTRALS ─── */
  --color-navy-950: #0A0F1E;
  --color-navy-900: #0F172A;
  --color-navy-800: #1E293B;
  --color-navy-700: #334155;
  --color-gray-600: #475569;
  --color-gray-500: #64748B;
  --color-gray-400: #94A3B8;
  --color-gray-300: #CBD5E1;
  --color-gray-200: #E2E8F0;
  --color-gray-100: #F1F5F9;
  --color-gray-50:  #F8FAFC;
  --color-white:    #FFFFFF;

  /* ─── VECHAIN PURPLE (blockchain verification only) ─── */
  --color-vechain-700: #5B21B6;
  --color-vechain-600: #7C3AED;
  --color-vechain-500: #8B5CF6;
  --color-vechain-400: #A78BFA;
  --color-vechain-200: #DDD6FE;
  --color-vechain-100: #EDE9FE;
  --color-vechain-50:  #F5F3FF;

  /* ─── SEMANTIC STATE COLORS ─── */
  --color-success:        #16A34A;
  --color-success-light:  #DCFCE7;
  --color-warning:        #D97706;
  --color-warning-light:  #FEF3C7;
  --color-error:          #DC2626;
  --color-error-light:    #FEE2E2;
  --color-info:           #0284C7;
  --color-info-light:     #E0F2FE;

  /* ─── SEMANTIC DESIGN TOKENS ─── */
  --color-bg-primary:       var(--color-gray-50);
  --color-bg-surface:       var(--color-white);
  --color-bg-elevated:      var(--color-white);
  --color-bg-subtle:        var(--color-gray-100);
  --color-bg-muted:         var(--color-gray-200);

  --color-text-primary:     var(--color-navy-950);
  --color-text-secondary:   var(--color-navy-700);
  --color-text-tertiary:    var(--color-gray-600);
  --color-text-disabled:    var(--color-gray-400);
  --color-text-inverse:     var(--color-white);
  --color-text-brand:       var(--color-green-700);
  --color-text-chain:       var(--color-vechain-600);

  --color-border-default:   var(--color-gray-200);
  --color-border-strong:    var(--color-gray-300);
  --color-border-focus:     var(--color-green-600);
  --color-border-chain:     var(--color-vechain-400);

  --color-interactive-primary:       var(--color-green-600);
  --color-interactive-primary-hover: var(--color-green-700);
  --color-interactive-primary-press: var(--color-green-900);

  /* ─── SPACING SYSTEM (4px base grid) ─── */
  --space-0:   0px;
  --space-px:  1px;
  --space-0-5: 0.125rem;  /* 2px  */
  --space-1:   0.25rem;   /* 4px  */
  --space-1-5: 0.375rem;  /* 6px  */
  --space-2:   0.5rem;    /* 8px  */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px */

  /* ─── BORDER RADIUS ─── */
  --radius-none: 0px;
  --radius-sm:   0.25rem;   /* 4px  */
  --radius-md:   0.5rem;    /* 8px  */
  --radius-lg:   0.75rem;   /* 12px */
  --radius-xl:   1rem;      /* 16px */
  --radius-2xl:  1.5rem;    /* 24px */
  --radius-full: 9999px;

  /* ─── SHADOWS / ELEVATION ─── */
  --shadow-xs:  0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-sm:  0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  --shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  --shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  --shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,0.05);
  --shadow-chain: 0 0 0 2px var(--color-vechain-200);

  /* ─── TRANSITIONS ─── */
  --duration-instant:  50ms;
  --duration-fast:     100ms;
  --duration-normal:   200ms;
  --duration-slow:     300ms;
  --duration-slower:   500ms;

  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);
  --ease-out:      cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);

  --transition-fast:   all var(--duration-fast) var(--ease-default);
  --transition-normal: all var(--duration-normal) var(--ease-default);
  --transition-slow:   all var(--duration-slow) var(--ease-default);

  /* ─── Z-INDEX HIERARCHY ─── */
  --z-base:      0;
  --z-raised:    10;
  --z-dropdown:  100;
  --z-sticky:    200;
  --z-overlay:   300;
  --z-modal:     400;
  --z-popover:   500;
  --z-toast:     600;
  --z-tooltip:   700;
  --z-above-all: 9999;

  /* ─── LAYOUT ─── */
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1536px;

  --sidebar-width:         240px;
  --sidebar-width-compact: 72px;
  --topbar-height:         64px;
  --content-max-width:     1200px;

  /* ─── FOCUS RING ─── */
  --focus-ring: 0 0 0 3px rgba(22, 163, 74, 0.4);
  --focus-ring-chain: 0 0 0 3px rgba(124, 58, 237, 0.35);
}
```

---

## Semantic Color Usage Guide

### When to Use Each Color Group

```
Brand Greens ──────────────────────────────────────────
  Use for: Primary actions, navigation, brand marks,
           sustainability metrics, success states,
           form focus states, active navigation items.

Navy & Neutrals ───────────────────────────────────────
  Use for: All body text, secondary content, borders,
           backgrounds, table rows, input fields,
           empty states, skeletal UI.

VeChain Purple ────────────────────────────────────────
  ONLY for: Smart contract verification badges,
            DPP blockchain verification stamps,
            "On-chain verified" indicators,
            Transaction hash displays,
            Immutability confirmation states.

  ⚠️ DO NOT use purple for general UI decoration,
     category tags, user interface chrome, or any
     element that is not directly related to
     blockchain data integrity verification.
```

---

## Component Design Specifications

### Button System

```
Primary Button
  Background: --color-green-600
  Text: --color-white
  Border: none
  Radius: --radius-md (8px)
  Padding: --space-2 --space-5 (8px 20px)
  Font: --font-semibold, --text-sm
  Hover: Background → --color-green-700
  Active: Background → --color-green-900
  Focus: box-shadow → --focus-ring
  Disabled: opacity 0.5, cursor not-allowed

Secondary Button
  Background: --color-white
  Text: --color-green-700
  Border: 1px solid --color-green-300
  Radius: --radius-md
  Hover: Background → --color-green-50

Destructive Button
  Background: --color-error
  Text: --color-white

Ghost Button
  Background: transparent
  Text: --color-text-secondary
  Border: none
  Hover: Background → --color-gray-100

Blockchain Verified Button (rare, specific)
  Background: --color-vechain-600
  Text: --color-white
  Usage: Only for "Verify on VeChainThor" actions
```

### Badge / Tag System

```
Status Badges:
  Active:    bg --color-success-light,  text --color-success
  Pending:   bg --color-warning-light,  text --color-warning
  Failed:    bg --color-error-light,    text --color-error
  Verified:  bg --color-vechain-100,    text --color-vechain-700
  Draft:     bg --color-gray-100,       text --color-gray-600

Category Tags (DPP, ESG, etc.):
  Background: --color-green-100
  Text: --color-green-800
  Radius: --radius-full (pill shape)
  Padding: --space-1 --space-3

Blockchain Verified Stamp:
  Background: --color-vechain-50
  Border: 1px solid --color-vechain-200
  Text: --color-vechain-700
  Icon: Shield + checkmark (VeChain-purple)
  Usage: ONLY when data is confirmed on-chain
```

### Card System

```
Default Card:
  Background: --color-bg-surface (white)
  Border: 1px solid --color-border-default
  Radius: --radius-lg (12px)
  Shadow: --shadow-sm
  Padding: --space-6

Elevated Card (modals, overlays):
  Shadow: --shadow-lg
  Background: --color-white

DPP Passport Card:
  Background: --color-white
  Left border accent: 4px solid --color-green-600
  Top right corner: Blockchain verified stamp (conditional)
  Contains: Product identity, lifecycle badge, verification state

ESG Metric Card:
  Background: gradient from --color-green-50 to white
  Large metric number: --text-4xl, --font-bold
  Trend indicator: arrow + percentage
  Bottom: sparkline chart

IoT Reading Card:
  Status indicator dot (live pulsing animation when active)
  Timestamp: --text-xs, --color-text-tertiary
  Reading value: --text-2xl, --font-semibold
  Health state: status badge
```

### Data Table

```
Table Container:
  Background: --color-white
  Border: 1px solid --color-border-default
  Radius: --radius-lg
  Overflow: hidden

Table Header:
  Background: --color-gray-50
  Text: --text-xs, --font-semibold, --tracking-wider, uppercase
  Color: --color-text-secondary
  Padding: --space-3 --space-4
  Border-bottom: 1px solid --color-border-default

Table Row:
  Padding: --space-4
  Border-bottom: 1px solid --color-gray-100
  Hover: Background → --color-gray-50

Table Cell (verified):
  Append blockchain verification icon inline
```

### Navigation

```
Top Navigation Bar:
  Height: --topbar-height (64px)
  Background: --color-white
  Border-bottom: 1px solid --color-border-default
  Shadow: --shadow-xs
  Content: Logo | Search | Notifications | Wallet Connect | Avatar

Left Sidebar:
  Width: --sidebar-width (240px)
  Background: --color-navy-900
  Text: --color-gray-300
  Active item: Background --color-navy-800, left border 3px --color-green-500
  Icons: 20px, matching text color

Bottom Nav (mobile):
  5 primary icons: Home, Passport, Marketplace, ESG, Circular
  Active: --color-green-600
  Inactive: --color-gray-400
```

---

## Icon System

### Icon Library: Lucide React

All icons must be sourced from Lucide React for consistency and bundle efficiency.

| Module | Primary Icons |
|--------|--------------|
| DPP | `QrCode`, `Package`, `MapPin`, `Award`, `Clock`, `FileText` |
| ESG | `Leaf`, `BarChart2`, `TrendingDown`, `Globe`, `Wind`, `Droplets` |
| IoT | `Activity`, `Thermometer`, `Droplet`, `Navigation`, `Radio`, `Wifi` |
| Circular Economy | `RefreshCw`, `Recycle`, `Trash2`, `Zap`, `Sprout`, `ArrowRightLeft` |
| Marketplace | `ShoppingCart`, `Building2`, `CheckCircle`, `DollarSign`, `Filter`, `Search` |
| Blockchain | `Shield`, `ShieldCheck`, `Lock`, `Link`, `Hash`, `CheckCircle2` |
| Navigation | `LayoutDashboard`, `Passport`, `Store`, `BarChart3`, `Settings`, `Bell` |

### Icon Sizing Standards

```
--icon-xs:  14px  — Inline with text, table cells
--icon-sm:  16px  — Buttons, input prefixes
--icon-md:  20px  — Navigation, card actions
--icon-lg:  24px  — Section headings, feature icons
--icon-xl:  32px  — Hero sections, empty states
--icon-2xl: 48px  — Landing page feature blocks
```

---

## Illustration Strategy

No stock photos. All visual concepts use:

1. **SVG Infographics** — Supply chain flow diagrams, lifecycle timelines
2. **Data Visualizations** — Charts, graphs, trend lines
3. **System Diagrams** — Architecture illustrations in SVG
4. **Icon Compositions** — Grouped icons to illustrate complex concepts
5. **Geometric Abstractions** — Grid patterns, node-and-edge graphs for blockchain

### Empty State Design

All empty states follow a consistent pattern:
- Centered layout, 160px max-width for illustration
- SVG icon composition (monochromatic, brand green)
- Primary headline: --text-lg, --font-semibold
- Sub-headline: --text-sm, --color-text-tertiary
- Optional CTA button (Primary or Secondary)

### Loading States

- Skeleton screens (not spinners) for data-heavy views
- Skeleton color: CSS gradient animation on --color-gray-100 to --color-gray-200
- Pulse animation: 1.5s ease-in-out infinite
- Never block the entire viewport; load content sections independently

---

## Accessibility Standards

| Requirement | Standard |
|-------------|---------|
| Color contrast | WCAG 2.2 AA minimum (4.5:1 for text, 3:1 for UI) |
| Keyboard navigation | Full tab order, visible focus rings on all interactive elements |
| Screen reader | Semantic HTML, ARIA labels on icons, aria-live for status updates |
| Touch targets | Minimum 44×44px for all interactive elements |
| Text scaling | No fixed-pixel font sizes that prevent browser scaling |
| Reduced motion | `@media (prefers-reduced-motion)` support for all animations |
| High contrast | Test all UI against forced-colors/high-contrast mode |

### Focus Ring Implementation

```css
/* All interactive elements */
:focus-visible {
  outline: 2px solid var(--color-green-600);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Blockchain verification elements */
.blockchain-interactive:focus-visible {
  outline-color: var(--color-vechain-600);
}
```

---

## Responsive Design Breakpoints

```
--breakpoint-sm:  640px   (mobile landscape, small tablets)
--breakpoint-md:  768px   (tablets)
--breakpoint-lg:  1024px  (small laptops)
--breakpoint-xl:  1280px  (standard laptops / desktops)
--breakpoint-2xl: 1536px  (large monitors, enterprise workstations)
```

### Layout Behavior

| Breakpoint | Layout Pattern |
|------------|---------------|
| `< 640px` | Single column, bottom navigation, stacked cards |
| `640–768px` | Two-column cards, collapsible sidebar |
| `768–1024px` | Sidebar (icon-only), 2-3 column grid |
| `> 1024px` | Full sidebar, data-dense multi-column layouts |
| `> 1280px` | Expanded sidebar, split-pane dashboards |

---

## Approved Module Visual Languages

### Digital Product Passport (DPP)

```
Color Accent: --color-green-600 (left border, headers)
Blockchain Stamp: --color-vechain-600 (top-right corner of verified passports)
Timeline: Vertical step list, icon per event type, color by event status
QR Code: High-contrast, centered on white card, WCAG-compliant
Certification Badges: Icon + text, rounded pill, green tint
```

### ESG Dashboard

```
Color Accent: --color-green-500 (metric graphs, trend arrows)
Carbon Metric: Large number display, subtitled "tCO₂e", trend sparkline
Compliance Level: Circular progress indicator, green → target percentage
Risk Map: SVG world map, colored nodes, no Mapbox dependency for MVP
Audit Export: PDF icon button, outlined, --color-gray-600
```

### IoT Monitoring

```
Color Accent: --color-info (sensor readings, live indicators)
Live Indicator: Pulsing green dot (animation respects prefers-reduced-motion)
Temperature: Gauge-style display or trend line
Alert State: Warning or error badge on card header, replaces live indicator
```

### Smart Procurement Marketplace

```
Color Accent: --color-green-700 (producer cards, listings)
Trust Badge: Verification stamp (VeChain purple), shown only if DPP-linked
Price Display: --text-2xl, --font-bold, with VET/VTHO equivalent shown below
Order State: Status badge + progress indicator
```

### Circular Economy Engine

```
Color Accent: --color-green-400 (diversion routes, waste categories)
Routing Diagram: SVG flow diagram — input → triage → destination
Diversion Metric: Tons diverted, prominent display like ESG metrics
Certificate: On-chain certificate card with blockchain verified stamp
```

---

## Design Anti-Patterns

The following patterns must **never** appear in NAMA:

```
❌ Candlestick or OHLC charts
❌ "Price" displays without procurement context
❌ Neon/fluorescent colors outside of error states
❌ Full-page dark backgrounds (dark mode is a future enhancement)
❌ Token count / balance as primary dashboard metric
❌ Animated ticker tape price feeds
❌ "Buy/Sell" language without business procurement context
❌ Confetti or celebratory animations on transactions
❌ Random gradients without semantic meaning
❌ Purple used for anything other than blockchain verification
```

---

*NAMA Design System v1.0 — Enterprise SaaS Foundation*  
*Aligned with WCAG 2.2 AA | VeChainThor Ecosystem*

---

## Attribution

```
Founder:      Isa Jassim Ali
Role:         Founder & Lead Architect
Project:      NAMA
Description:  NAMA is a global trust infrastructure for sustainable food systems built
              around digital product passports, food traceability, ESG intelligence,
              circular economy tracking, and enterprise supply-chain transparency.
GitHub:       https://github.com/essajassim90-arch
VeWorld:      [TO BE PROVIDED LATER]
```
