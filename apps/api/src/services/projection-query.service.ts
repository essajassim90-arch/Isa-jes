import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import Database from 'better-sqlite3'

interface PassportStateRow {
  passportId: string
  batchId: string | null
  owner: string | null
  product: string | null
  origin: string | null
  active: number | null
  createdAt: string | null
  updatedAt: string | null
}

interface DomainEventRow {
  eventId: string
  aggregateType: string
  aggregateId: string
  eventName: string
  payloadJson: string
  occurredAt: string
  indexedAt: string
}

interface PassportTimelineRow {
  eventType: string
  actor: string | null
  locationCode: string | null
  eventTimestamp: string | null
  occurredAt: string
}

interface ListingStateRow {
  listingId: string
  seller: string | null
  passportId: string | null
  unitPrice: string | null
  quantity: string | null
  status: string | null
  createdAt: string | null
  updatedAt: string | null
}

interface OfferStateRow {
  offerId: string
  listingId: string | null
  buyer: string | null
  quantity: string | null
  totalPrice: string | null
  status: string | null
  placedAt: string | null
  acceptedAt: string | null
  updatedAt: string | null
}

class ProjectionQueryService {
  #db: Database.Database | null | undefined

  #resolveProjectionDbPath(): string | null {
    const configured = process.env['PROJECTION_DB_PATH'] ?? process.env['INDEXER_PROJECTION_DB_PATH']

    const candidates = [
      configured,
      resolve(process.cwd(), 'apps/indexer/data/projections.db'),
      resolve(process.cwd(), 'apps/indexer/projections.db'),
      resolve(process.cwd(), 'data/projections.db')
    ]

    for (const candidate of candidates) {
      if (candidate && existsSync(candidate)) {
        return candidate
      }
    }

    return null
  }

  #getDb(): Database.Database | null {
    if (this.#db !== undefined) {
      return this.#db
    }

    const dbPath = this.#resolveProjectionDbPath()
    if (!dbPath) {
      this.#db = null
      return this.#db
    }

    try {
      const db = new Database(dbPath, { readonly: true, fileMustExist: true })
      this.#db = db
      return db
    } catch {
      this.#db = null
      return this.#db
    }
  }

  #hasRows(tableName: string): boolean {
    const db = this.#getDb()
    if (!db) {
      return false
    }

    try {
      const row = db.prepare(`SELECT 1 AS has_row FROM ${tableName} LIMIT 1`).get() as { has_row?: number } | undefined
      return row?.has_row === 1
    } catch {
      return false
    }
  }

  hasPassportProjectionData(): boolean {
    return this.#hasRows('dpp_passports')
  }

  hasMarketplaceListingProjectionData(): boolean {
    return this.#hasRows('marketplace_listings')
  }

  hasMarketplaceOfferProjectionData(): boolean {
    return this.#hasRows('marketplace_offers')
  }

  getPassportStateByBatchId(batchId: string): PassportStateRow | null {
    const db = this.#getDb()
    if (!db) {
      return null
    }

    getPassportStates(limit = 50): PassportStateRow[] {
      const db = this.#getDb()
      if (!db) {
        return []
      }

      try {
        return db
          .prepare(
            `SELECT
              passport_id AS passportId,
              batch_id AS batchId,
              owner,
              product,
              origin,
              active,
              created_at AS createdAt,
              updated_at AS updatedAt
            FROM dpp_passports
            ORDER BY datetime(COALESCE(updated_at, created_at)) DESC, passport_id DESC
            LIMIT ?`
          )
          .all(limit) as PassportStateRow[]
      } catch {
        return []
      }
    }

    try {
      const row = db
        .prepare(
          `SELECT
            passport_id AS passportId,
            batch_id AS batchId,
            owner,
            product,
            origin,
            active,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM dpp_passports
          WHERE batch_id = ?
          LIMIT 1`
        )
        .get(batchId) as PassportStateRow | undefined

      return row ?? null
    } catch {
      return null
    }
  }

  getPassportTimeline(passportId: string): PassportTimelineRow[] {
    const db = this.#getDb()
    if (!db) {
      return []
    }

    try {
      return db
        .prepare(
          `SELECT
            event_type AS eventType,
            actor,
            location_code AS locationCode,
            event_timestamp AS eventTimestamp,
            occurred_at AS occurredAt
          FROM dpp_timeline_events
          WHERE passport_id = ?
          ORDER BY datetime(COALESCE(event_timestamp, occurred_at)) ASC, event_id ASC`
        )
        .all(passportId) as PassportTimelineRow[]
    } catch {
      return []
    }
  }

  getOpenListings(): ListingStateRow[] {
    const db = this.#getDb()
    if (!db) {
      return []
    }

    try {
      return db
        .prepare(
          `SELECT
            listing_id AS listingId,
            seller,
            passport_id AS passportId,
            unit_price AS unitPrice,
            quantity,
            status,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM marketplace_listings
          WHERE lower(COALESCE(status, '')) = 'open'
          ORDER BY datetime(COALESCE(created_at, updated_at)) DESC, listing_id DESC`
        )
        .all() as ListingStateRow[]
    } catch {
      return []
    }
  }

  getListingState(listingId: string): ListingStateRow | null {
    const db = this.#getDb()
    if (!db) {
      return null
    }

    try {
      const row = db
        .prepare(
          `SELECT
            listing_id AS listingId,
            seller,
            passport_id AS passportId,
            unit_price AS unitPrice,
            quantity,
            status,
            created_at AS createdAt,
            updated_at AS updatedAt
          FROM marketplace_listings
          WHERE listing_id = ?
          LIMIT 1`
        )
        .get(listingId) as ListingStateRow | undefined

      return row ?? null
    } catch {
      return null
    }
  }

  getOfferState(offerId: string): OfferStateRow | null {
    const db = this.#getDb()
    if (!db) {
      return null
    }

    try {
      const row = db
        .prepare(
          `SELECT
            offer_id AS offerId,
            listing_id AS listingId,
            buyer,
            quantity,
            total_price AS totalPrice,
            status,
            placed_at AS placedAt,
            accepted_at AS acceptedAt,
            updated_at AS updatedAt
          FROM marketplace_offers
          WHERE offer_id = ?
          LIMIT 1`
        )
        .get(offerId) as OfferStateRow | undefined

      return row ?? null
    } catch {
      return null
    }

    getRecentDomainEvents(limit = 25): DomainEventRow[] {
      const db = this.#getDb()
      if (!db) {
        return []
      }

      try {
        return db
          .prepare(
            `SELECT
              event_id AS eventId,
              aggregate_type AS aggregateType,
              aggregate_id AS aggregateId,
              event_name AS eventName,
              payload_json AS payloadJson,
              occurred_at AS occurredAt,
              indexed_at AS indexedAt
            FROM domain_events
            ORDER BY datetime(occurred_at) DESC, event_id DESC
            LIMIT ?`
          )
          .all(limit) as DomainEventRow[]
      } catch {
        return []
      }
    }
  }
}

export const projectionQueryService = new ProjectionQueryService()
