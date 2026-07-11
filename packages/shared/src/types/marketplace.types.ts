export type ListingStatus = 'open' | 'closed' | 'cancelled'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'settled' | 'refunded'

export interface MarketplaceListing {
  listingId: string
  dppId: string
  sellerOrgId: string
  quantity: number
  unitPriceVET: string
  currency: 'VET'
  status: ListingStatus
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
