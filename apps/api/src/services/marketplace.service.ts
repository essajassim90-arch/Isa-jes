import { randomUUID } from 'node:crypto'
import type { MarketplaceListing, MarketplaceOffer } from '@nama/shared'

// In-memory stores — replaced with on-chain + DB persistence in later phases
const listings = new Map<string, MarketplaceListing>()
const offers = new Map<string, MarketplaceOffer>()

// Seed demo listing for demo-batch-001 on startup
listings.set('demo-listing-001', {
  listingId: 'demo-listing-001',
  dppId: 'demo-dpp-001',
  sellerOrgId: 'FARM-KE-001',
  quantity: 500,
  unitPriceVET: '10',
  currency: 'VET',
  status: 'open',
  createdAt: '2025-03-20T09:00:00.000Z',
})

interface CreateListingPayload {
  dppId: string
  sellerOrgId: string
  quantity: number
  unitPriceVET: string
}

function isCreateListingPayload(value: unknown): value is CreateListingPayload {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p['dppId'] === 'string' &&
    typeof p['sellerOrgId'] === 'string' &&
    typeof p['quantity'] === 'number' &&
    (p['quantity'] as number) > 0 &&
    typeof p['unitPriceVET'] === 'string'
  )
}

interface CreateOrderPayload {
  listingId: string
  buyerOrgId: string
  quantity: number
  totalPriceVET: string
}

function isCreateOrderPayload(value: unknown): value is CreateOrderPayload {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>
  return (
    typeof p['listingId'] === 'string' &&
    typeof p['buyerOrgId'] === 'string' &&
    typeof p['quantity'] === 'number' &&
    (p['quantity'] as number) > 0 &&
    typeof p['totalPriceVET'] === 'string'
  )
}

class MarketplaceService {
  getListings(): MarketplaceListing[] {
    return [...listings.values()].filter((l) => l.status === 'open')
  }

  createListing(payload: unknown): MarketplaceListing {
    if (!isCreateListingPayload(payload)) {
      throw new Error(
        'Invalid listing payload: dppId, sellerOrgId, quantity (>0), and unitPriceVET are required',
      )
    }
    const listing: MarketplaceListing = {
      listingId: randomUUID(),
      dppId: payload.dppId,
      sellerOrgId: payload.sellerOrgId,
      quantity: payload.quantity,
      unitPriceVET: payload.unitPriceVET,
      currency: 'VET',
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    listings.set(listing.listingId, listing)
    return listing
  }

  createOrder(payload: unknown): MarketplaceOffer {
    if (!isCreateOrderPayload(payload)) {
      throw new Error(
        'Invalid order payload: listingId, buyerOrgId, quantity (>0), and totalPriceVET are required',
      )
    }
    const listing = listings.get(payload.listingId)
    if (!listing || listing.status !== 'open') {
      throw new Error(`Listing "${payload.listingId}" not found or not open`)
    }
    const offer: MarketplaceOffer = {
      offerId: randomUUID(),
      listingId: payload.listingId,
      buyerOrgId: payload.buyerOrgId,
      quantity: payload.quantity,
      totalPriceVET: payload.totalPriceVET,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    offers.set(offer.offerId, offer)
    return offer
  }
}

export const marketplaceService = new MarketplaceService()
