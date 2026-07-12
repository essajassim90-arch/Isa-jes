# NAMA Commercial Operating Model

**Version:** 1.0  
**Status:** Documentation & Demo Layer — Phase 1 / Phase 2 Planning  
**Project:** NAMA — Global Trust Infrastructure for Sustainable Food Systems

> ⚠️ **Non-binding disclaimer:** All revenue-share percentages, fee structures, and stakeholder arrangements described in this document are illustrative concepts for planning and demonstration purposes only. They do not constitute a legal agreement, a financial commitment, or a contractual obligation of any kind. Final commercial terms will be negotiated separately in each partnership. Nothing in this document affects the NAMA smart-contract code, deployment pipeline, or on-chain logic.

---

## Overview

NAMA generates value at three structural layers of the food supply chain:

| Layer | Mechanism | Phase |
|-------|-----------|-------|
| Procurement cost reduction | AII scoring + verified sourcing | Phase 2 |
| Circular recovery monetisation | Surplus food → secondary value chains | Phase 2–3 |
| Strategic supplier participation | Preferred terms for long-term partners | Phase 3–4 |

These models are documented here as a commercial planning reference. No payment contracts, revenue-splitting logic, or financial settlement code exists in the current codebase.

---

## Model 1 — Shared Savings Procurement Model

### Target stakeholders

- Institutional food buyers (hospitals, airlines, hotel chains, universities)
- Municipal procurement offices

### Concept

Traditional food procurement pays a fixed contract price with no visibility into whether the supply chain is delivering value beyond the face price. NAMA introduces a **verified savings layer**:

1. Buyer procures through the NAMA marketplace using AII-qualified listings.
2. NAMA's AII engine measures verifiable quality signals (certifications, telemetry, traceability events).
3. Where NAMA-sourced procurement demonstrably costs less than the buyer's conventional baseline, a **savings-share** arrangement applies.

### Stakeholder flow

```
Conventional procurement cost (baseline)
        │
        ▼
NAMA procurement cost (AII-qualified sourcing)
        │
        ▼
Verified savings = conventional cost − NAMA cost
        │
        ├── Buyer retains majority of savings
        └── NAMA participates in a configurable share of verified savings
```

### Illustrative demo values

| Item | Value |
|------|-------|
| Conventional procurement cost (demo) | $108,000 / quarter |
| NAMA procurement cost (demo) | $82,000 / quarter |
| Verified savings | $26,000 / quarter |
| NAMA savings-share (demo rate — configurable) | 15% of verified savings |
| NAMA revenue from savings-share | $3,900 / quarter |
| Buyer net saving | $22,100 / quarter |

> These values are demo placeholders. They use no real customer names, no real prices, and no real contracts.

### What is implemented now

- AII score calculation and display (Phase 2K) ✅
- Procurement insights panel on the Enterprise Dashboard ✅
- Demo panel showing conventional cost vs NAMA cost vs verified savings (this release) ✅

### What is future

- Live savings calculation against buyer's own ERP baseline (Phase 3)
- Contractual savings-share terms negotiated per enterprise client (Phase 3–4)
- On-chain savings attestation (optional — Phase 4)

---

## Model 2 — Circular Recovery Revenue Share Model

### Target stakeholders

- Municipalities and waste management bodies
- Cloud kitchens, hospital catering, airline catering
- Animal feed producers, composting facilities, bioenergy operators

### Concept

Surplus, spoiled, or non-retail food is routed into verified secondary value chains (animal feed, compost, bioenergy) via the NAMA Circular Economy Engine. Revenue generated from these secondary channels is shared between:

| Party | Share | Notes |
|-------|-------|-------|
| Municipality / recovery partner | 50% | Primary recovery operator |
| NAMA Protocol | 40% | Platform infrastructure + routing |
| Cooperating institution | 10% | Cloud kitchen, hospital, or airline contributing the surplus |

> **This split is a configurable commercial model, not a hardcoded rule.** Individual partnership agreements may use different splits. The 40/50/10 example is a planning reference only.

### Stakeholder flow

```
Surplus food identified by institution (cloud kitchen / hospital / airline)
        │
        ▼
NAMA Circular Economy Engine routes to verified secondary buyer
        │
        ▼
Secondary sale generates circular recovery revenue
        │
        ├── 50% → Municipality / recovery partner
        ├── 40% → NAMA Protocol
        └── 10% → Contributing institution
```

### Illustrative demo values

| Item | Value |
|------|-------|
| Circular routes completed (demo) | 2 routes |
| kg diverted (demo) | 60.5 kg |
| Estimated circular recovery revenue (demo) | $1,210 |
| Municipality / recovery partner share (50%) | $605 |
| NAMA share (40%) | $484 |
| Contributing institution share (10%) | $121 |

> These values are demo placeholders. No real revenue splits, no payment contracts, no financial settlement logic exists in the codebase.

### What is implemented now

- Circular diversion routes recorded via `recordPassportEvent` on DPP.sol ✅
- Circular Economy Engine page with route tracking and ESG badges ✅
- Demo panel showing circular recovery revenue breakdown (this release) ✅

### What is future

- Verified secondary-market revenue calculation (Phase 3)
- Automated revenue routing via smart contract (optional — Phase 4)
- Per-partnership configurable split parameters (Phase 3)

---

## Model 3 — Strategic Supplier Participation Model

### Target stakeholders

- Producers, cooperatives, and long-term supplier partners
- Agricultural SMEs and regional food hubs

### Concept

Suppliers who build a verified track record on NAMA — through DPP creation, telemetry data, certifications, and marketplace participation — may receive preferred participation terms in future phases.

> **No exact future percentages are defined at this time.** Strategic supplier benefits will be negotiated in Phase 3–4 commercial partnership discussions.

### Tiers (planning reference only)

| Tier | Criteria | Future benefit direction |
|------|----------|--------------------------|
| **Standard** | Registered producer with at least one active DPP | Access to NAMA marketplace and AII scoring |
| **Preferred** | AII grade B+ · at least one active certification · 3+ verified telemetry events | Priority listing placement · future fee reduction |
| **Strategic** | Long-term producer agreement · circular route participation · heritage vault entry | Phase 3–4 participation benefits (to be defined) |

> Tier assignments are currently simulated in the demo layer. No on-chain tier logic exists.

### What is implemented now

- AII score and grade per batch (Phase 2K) ✅
- Heritage Vault entries (Phase 2M) ✅
- Supplier participation tier type definitions (this release) ✅

### What is future

- Supplier tier-based fee schedule (Phase 3)
- On-chain participation benefit events (Phase 4)

---

## Phase Placement Summary

| Commercial model | Current phase | Demo representation | Contract required | Live revenue |
|-----------------|---------------|--------------------|--------------------|--------------|
| Shared Savings Procurement | Phase 2 planning | ✅ Demo panel (read-only) | ❌ No | ❌ No |
| Circular Recovery Revenue Share | Phase 2 planning | ✅ Demo panel (read-only) | ❌ No | ❌ No |
| Strategic Supplier Participation | Phase 3–4 planning | ✅ Type definitions only | ❌ No | ❌ No |

---

## What is NOT in the codebase

The following are explicitly **not implemented** and **not planned** for Phase 1 or Phase 2:

- Payment contracts or revenue-splitting smart contracts
- Real financial settlement or fiat/token disbursement logic
- Legal commercial agreements or binding terms
- Mainnet financial operations
- Real customer names, real prices, or real contractual counterparties

---

## Related Documentation

| Document | Description |
|----------|-------------|
| [docs/BRAND_SYSTEM.md](BRAND_SYSTEM.md) | Visual identity — Leaf-N mark, colour palette, Arabic tagline, badge system, usage rules |
| [docs/DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Design tokens, CSS variables, typography scale, component specs |
| [docs/UI_ARCHITECTURE.md](UI_ARCHITECTURE.md) | Page structure, user journeys, layout patterns |
| [WHITEPAPER.md](../WHITEPAPER.md) | Full technical and commercial deep-dive |
