# NAMA Brand System

**Version:** 1.0  
**Status:** Approved — Visual Identity Foundation  
**Project:** NAMA — Global Trust Infrastructure for Sustainable Food Systems

---

## Brand Origin

The NAMA visual identity evolved from hand sketches produced during the founding design phase of the protocol. The chosen direction synthesises four core ideas into a single cohesive mark:

- **Agriculture** — the leaf form as a universal symbol of food, growth, and the natural world
- **Digital trust** — the structural geometry of the letter N anchoring the mark in technology
- **Sustainability** — deep green as the defining brand colour, communicating environmental intent
- **Verification** — clean, scalable geometry that reproduces crisply at any size, from favicon to billboard

The Digital Product Passport card is the **primary visual proof object** in the NAMA demo. It is the tangible expression of the protocol — the artefact a buyer, auditor, or regulator sees when they scan a QR code or open the dashboard.

---

## Primary Brand Identity

### The Leaf-N Mark

The NAMA wordmark is anchored by the **Leaf-N mark** — a letterform constructed from the letter **N** with a stylised leaf integrated into its geometry.

| Property | Value |
|----------|-------|
| Form | Letter N with integrated leaf motif |
| Geometry | Clean straight strokes; leaf emerging from the upper-right diagonal of the N |
| Orientation | Upright; leaf tip points upward |
| Minimum size | 24 × 24 px (icon only); 120 px wide (full wordmark) |
| Clear space | Equal to the x-height of the wordmark on all sides |
| Colourways | Deep Green on White (primary); White on Deep Green (reversed); White on Dark Navy (enterprise) |
| Prohibited | No rotation; no stroke effects; no drop shadows; no colour substitution outside the defined palette |

### Primary Positioning

> **"Global Trust Infrastructure for Sustainable Food Systems"**

### Arabic Tagline

> **ثقة غذائية مستدامة**  
> *"Sustainable Food Trust"*

The Arabic tagline is the official secondary tagline for Middle East and North Africa markets. It must be set in a clean, high-legibility Arabic typeface (such as IBM Plex Arabic or Noto Sans Arabic) at a weight equivalent to the primary tagline weight. The tagline must not be transliterated in Latin characters as a substitute.

### Core Colour Palette

These three anchors define the NAMA brand at every touchpoint.

| Name | Hex | Role |
|------|-----|------|
| **Deep Green** | `#14532D` | Primary brand colour — sustainability, trust, growth |
| **Dark Navy** | `#0F172A` | Enterprise background — reliability, authority, depth |
| **Clean White** | `#FFFFFF` | SaaS clarity — readability, openness, space |

---

## Secondary Visual Systems

### Digital Product Passport (DPP) Card

The DPP card is the central visual artefact of the protocol. It communicates product identity, batch origin, supply-chain status, and verification state in a single scannable object.

| Property | Specification |
|----------|---------------|
| Format | Landscape card, 16:9 ratio at screen; portrait A6 for print |
| Background | Clean White or soft gray (`#F8FAFC`) |
| Header band | Deep Green strip containing the Leaf-N mark and batch identifier |
| Verification strip | VeChain purple (`#7C3AED`) bottom band — shown only when on-chain proof is present |
| Typography | Inter; batch ID in monospace (`font-family: 'JetBrains Mono', monospace`) |
| Key fields | Product name · Origin region · Certifications · Issue date · Blockchain transaction ID |
| QR code | Bottom-right; links to on-chain passport data |
| Status badge | Embedded inline (see Verification Badge System below) |

> ⚠️ Do not use low-resolution sketch images directly in production UI. Convert final DPP card assets into SVG components or high-resolution PNG exports before integration.

---

### Circular Economy Badge

Used on product cards and DPP entries to indicate that a batch participates in a certified circular economy programme.

| Property | Value |
|----------|-------|
| Shape | Rounded square icon (16 × 16 / 24 × 24 / 32 × 32) |
| Colour | Deep Green fill; Clean White icon |
| Icon | Circular arrow / recycling loop motif |
| Label | "Circular" |
| Usage context | Marketplace listing cards, DPP card certification section, ESG dashboard |

---

### Food Security / Sovereignty Badge

Indicates that a product or producer meets a food security or food sovereignty standard.

| Property | Value |
|----------|-------|
| Shape | Shield with grain / wheat icon |
| Colour | Amber (`#D97706`) fill; Clean White icon — distinct from the green trust palette to signal a specialised standard |
| Label | "Food Secure" or "Sovereign Source" depending on certification tier |
| Usage context | Producer profile cards, DPP card certification section |

---

### Producer Mobile Identity

The producer-facing mobile interface uses a simplified version of the NAMA brand to reduce cognitive load for smallholder and SME farmers.

| Property | Value |
|----------|-------|
| Primary colour | Deep Green |
| Secondary | Clean White |
| Typography scale | Larger base size (18 px body); reduced hierarchy depth |
| Mark | Leaf-N icon only (no wordmark) at native app icon size |
| Tone | Approachable, guided, low-jargon |
| Badge placement | Bottom navigation bar; prominent verification status chip on home screen |

---

### Enterprise Dashboard Identity

The enterprise-facing dashboard surfaces supply-chain analytics, procurement workflows, and ESG compliance data.

| Property | Value |
|----------|-------|
| Primary background | Dark Navy (`#0F172A`) sidebar; Clean White / soft gray main content area |
| Accent | Deep Green for primary actions, navigation highlights, and active states |
| Data visualisation palette | Deep Green (primary series) · Amber (warning) · Slate (`#64748B`) (neutral) |
| Typography | Inter throughout; heavier weights for KPI figures |
| Mark | Full Leaf-N wordmark in sidebar header |
| Density | High — enterprise users expect information-dense layouts |

---

### Verification Badge System

The verification badge communicates cryptographic proof state. It is the one context where **VeChain purple** is permitted in the NAMA colour system.

| State | Colour | Label | Icon |
|-------|--------|-------|------|
| Verified on-chain | VeChain Purple `#7C3AED` | "Verified" | Shield + checkmark |
| Pending verification | Amber `#D97706` | "Pending" | Clock |
| Not yet submitted | Slate `#64748B` | "Unverified" | Shield outline |
| Revoked / flagged | Red `#DC2626` | "Revoked" | X shield |

Badges must be rendered as inline SVG components at **16 px, 20 px, or 24 px** only. They must include an accessible `aria-label` attribute matching the label text.

---

## Visual Usage Rules

### Colour Governance

| Rule | Detail |
|------|--------|
| VeChain Purple (`#7C3AED`) | **Reserved exclusively** for cryptographic verification indicators — verification badges, transaction hash displays, on-chain proof callouts. Never used as a general brand accent. |
| Deep Green | Represents sustainability and trust. Primary CTA buttons, navigation, brand marks, DPP header bands, Leaf-N mark. |
| Dark Navy | Represents enterprise-grade reliability. Sidebar backgrounds, data-dense dashboard areas, headings on white. |
| Clean White + Soft Gray (`#F8FAFC`) | SaaS clarity and breathing room. Main content backgrounds, card surfaces, input fields. |
| Amber (`#D97706`) | Warning states, pending verification, Food Security / Sovereignty badge only. Not a primary brand colour. |

### Asset Production Rules

| Rule | Detail |
|------|--------|
| No sketch images in production | Hand-sketch source images must not be embedded in UI components, DPP cards, or marketing materials. |
| SVG-first | All marks, badges, and icons must be delivered as SVG for UI integration. |
| PNG exports | Provide `1×`, `2×`, and `3×` PNG exports for contexts that do not support SVG (email, native app stores). |
| Favicon | 32 × 32 px ICO + 180 × 180 px Apple touch icon derived from Leaf-N mark. |
| App icon | 1024 × 1024 px master at 100% Deep Green background with centred white Leaf-N mark. |
| DPP card component | Final DPP card must be a React component accepting typed props — not a static image. |

### What to Avoid

- Rendering the Leaf-N mark at sizes below 24 px without switching to a single-colour silhouette variant
- Using VeChain purple for anything other than cryptographic verification
- Mixing the enterprise dark palette with the mobile-light palette in a single view
- Translating the Arabic tagline into Latin characters as a visual substitute
- Adding drop shadows, gradients, or glow effects to the Leaf-N mark
- Using the circular economy badge on products that do not hold a certified circular standard

---

## Roadmap: Asset Conversion

The following assets are pending final production conversion from sketch / concept to deliverable format:

| Asset | Target Format | Priority |
|-------|--------------|----------|
| Leaf-N wordmark | SVG (outlined) | P0 |
| Leaf-N icon (square) | SVG + PNG 1×/2×/3× | P0 |
| Favicon package | ICO + PNG | P0 |
| App icon | PNG 1024 × 1024 | P0 |
| DPP card component | React TSX + CSS | P0 |
| Verification badge set (4 states) | SVG inline components | P1 |
| Circular Economy badge | SVG inline component | P1 |
| Food Security / Sovereignty badge | SVG inline component | P1 |
| Arabic tagline lockup | SVG (text outlined) | P1 |

---

## Related Documentation

| Document | Description |
|----------|-------------|
| [docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Design tokens, CSS variables, typography scale, component specs |
| [docs/UI_ARCHITECTURE.md](UI_ARCHITECTURE.md) | Page structure, user journeys, layout patterns |
| [docs/COMPONENT_ARCHITECTURE.md](COMPONENT_ARCHITECTURE.md) | React component hierarchy and TypeScript models |
