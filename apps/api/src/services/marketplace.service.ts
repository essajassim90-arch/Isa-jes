import { randomUUID } from 'node:crypto'
import type { MarketplaceListing, MarketplaceOffer } from '@nama/shared'
import { projectionQueryService } from './projection-query.service.ts'

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

function parseInteger(value: string | null, fallback = 0): number {
  if (!value) {
    return fallback
  }

  const numeric = Number.parseInt(value, 10)
  return Number.isFinite(numeric) ? numeric : fallback
}

function toListingStatus(value: string | null): MarketplaceListing['status'] {
  const normalized = value?.toLowerCase()
  if (normalized === 'cancelled') {
    return 'cancelled'
  }
  if (normalized === 'closed') {
    return 'closed'
  }
  return 'open'
}

function toOfferStatus(value: string | null): MarketplaceOffer['status'] {
  const normalized = value?.toLowerCase()
  if (normalized === 'accepted') {
    return 'accepted'
  }
  if (normalized === 'rejected') {
    return 'rejected'
  }
  if (normalized === 'settled') {
    return 'settled'
  }
  if (normalized === 'refunded') {
    return 'refunded'
  }
  return 'pending'
}

class MarketplaceService {
  getListings(): MarketplaceListing[] {
    if (projectionQueryService.hasMarketplaceListingProjectionData()) {
      return projectionQueryService.getOpenListings().map((listing) => ({
        listingId: listing.listingId,
        dppId: listing.passportId ?? 'unknown',
        sellerOrgId: listing.seller ?? 'unknown',
        quantity: parseInteger(listing.quantity),
        unitPriceVET: listing.unitPrice ?? '0',
        currency: 'VET',
        status: toListingStatus(listing.status),
        createdAt: listing.createdAt ?? listing.updatedAt ?? new Date().toISOString(),
        updatedAt: listing.updatedAt ?? undefined
      }))
    }

    return [...listings.values()].filter((l) => l.status === 'open')
  }

  getListingState(listingId: string): MarketplaceListing | undefined {
    if (projectionQueryService.hasMarketplaceListingProjectionData()) {
      const listing = projectionQueryService.getListingState(listingId)
      if (!listing) {
        return undefined
      }

      return {
        listingId: listing.listingId,
        dppId: listing.passportId ?? 'unknown',
        sellerOrgId: listing.seller ?? 'unknown',
        quantity: parseInteger(listing.quantity),
        unitPriceVET: listing.unitPrice ?? '0',
        currency: 'VET',
        status: toListingStatus(listing.status),
        createdAt: listing.createdAt ?? listing.updatedAt ?? new Date().toISOString(),
        updatedAt: listing.updatedAt ?? undefined
      }
    }

    return listings.get(listingId)
  }

  getOfferState(offerId: string): MarketplaceOffer | undefined {
    if (projectionQueryService.hasMarketplaceOfferProjectionData()) {
      const offer = projectionQueryService.getOfferState(offerId)
      if (!offer) {
        return undefined
      }

      return {
        offerId: offer.offerId,
        listingId: offer.listingId ?? 'unknown',
        buyerOrgId: offer.buyer ?? 'unknown',
        quantity: parseInteger(offer.quantity),
        totalPriceVET: offer.totalPrice ?? '0',
        status: toOfferStatus(offer.status),
        createdAt: offer.placedAt ?? offer.updatedAt ?? new Date().toISOString()
      }
    }

    return offers.get(offerId)
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
