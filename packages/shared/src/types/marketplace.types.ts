export type ListingStatus = 'open' | 'closed' | 'cancelled'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'settled' | 'refunded'
export type ListingType = 'commercial' | 'circular'

export interface MarketplaceListing {
  listingId: string
  dppId: string
  sellerOrgId: string
  quantity: number
  unitPriceVET: string
  currency: 'VET'
  status: ListingStatus
  /** 'commercial' = standard B2B procurement; 'circular' = diversion/secondary-use listing */
  listingType?: ListingType
  /** kg available for circular diversion (populated when listingType === 'circular') */
  kgAvailable?: number
  /** Primary SDG alignment for circular listings */
  circularSdgGoals?: number[]
  aiiQualityIndicator?: 'premium' | 'qualified' | 'watchlist'
  procurementSignal?: 'strong' | 'moderate' | 'review'
  createdAt: string
  updatedAt?: string
}

export interface MarketplaceOffer {
  offerId: string
  listingId: string
  buyerOrgId: string
  quantity: number
  totalPriceVET: string
  status: OfferStatus
  createdAt: string
  settledAt?: string
  txHash?: string
}

export interface MarketplaceSettlement {
  settlementId: string
  listingId: string
  offerId: string
  amountVET: string
  settledAt: string
  txHash: string
}
