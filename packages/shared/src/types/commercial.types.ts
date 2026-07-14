/**
 * Commercial operating model types — documentation and demo layer only.
 *
 * These types represent the NAMA commercial model concepts for planning and
 * demo purposes. No payment contracts, revenue-splitting logic, or financial
 * settlement code exists in the current codebase. All values are demo
 * placeholders and do not constitute legal or financial commitments.
 */

export interface ProcurementSavingsModel {
  /** Institutional buyer identifier (demo placeholder — no real names) */
  buyerOrgId: string
  /** Procurement period label, e.g. "Q1 2025" */
  period: string
  /** Conventional procurement cost in demo currency units */
  conventionalCostUsd: number
  /** NAMA-facilitated procurement cost in demo currency units */
  namaCostUsd: number
  /** Verified savings = conventionalCostUsd − namaCostUsd */
  verifiedSavingsUsd: number
  /**
   * NAMA savings-share rate (0–1).
   * Configurable per commercial partnership — not a hardcoded legal rule.
   * Demo default: 0.15
   */
  namaSavingsShareRate: number
  /** NAMA revenue from savings-share = verifiedSavingsUsd × namaSavingsShareRate */
  namaRevenueUsd: number
  /** Buyer net saving = verifiedSavingsUsd − namaRevenueUsd */
  buyerNetSavingUsd: number
}

export interface CircularRevenueShare {
  /** Circular route or batch identifier */
  routeId: string
  /** Total estimated circular recovery revenue in demo currency units */
  totalCircularRevenueUsd: number
  /**
   * Municipality / recovery partner share rate (0–1).
   * Configurable per partnership — demo default: 0.50
   */
  municipalityShareRate: number
  /**
   * NAMA Protocol share rate (0–1).
   * Configurable per partnership — demo default: 0.40
   */
  namaShareRate: number
  /**
   * Cooperating institution share rate (0–1).
   * e.g. cloud kitchen, hospital, or airline contributing the surplus.
   * Configurable per partnership — demo default: 0.10
   */
  institutionShareRate: number
  /** Municipality / recovery partner revenue = totalCircularRevenueUsd × municipalityShareRate */
  municipalityRevenueUsd: number
  /** NAMA revenue = totalCircularRevenueUsd × namaShareRate */
  namaRevenueUsd: number
  /** Contributing institution revenue = totalCircularRevenueUsd × institutionShareRate */
  institutionRevenueUsd: number
}

/**
 * Strategic supplier participation tier.
 * Tiers are planning references only — no on-chain tier logic exists.
 * Future benefits for Preferred and Strategic tiers will be defined in Phase 3–4.
 */
export type SupplierParticipationTier = 'standard' | 'preferred' | 'strategic'

export interface SupplierParticipationModel {
  /** Supplier / producer identifier */
  producerOrgId: string
  tier: SupplierParticipationTier
  /**
   * Criteria satisfied for the assigned tier.
   * Demo values only — not derived from live on-chain data in Phase 1.
   */
  criteriaSatisfied: string[]
  /**
   * Forward-looking benefit description.
   * Exact percentages and terms are not defined until Phase 3–4 negotiations.
   */
  futureBenefitDirection: string
}
