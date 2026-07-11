import Database from 'better-sqlite3';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { NormalizedEventEnvelope } from '../versioning/schema.js';
import type { ProjectionStore } from '../projections/types.js';
import { INDEX_DEFINITIONS, TABLE_DEFINITIONS } from './schema.js';

interface DppPassportRow {
  passportId: string;
  batchId?: string;
  owner?: string;
  product?: string;
  origin?: string;
  active?: number;
  createdAt?: string;
  updatedAt: string;
  lastEventId: string;
}

interface ListingRow {
  listingId: string;
  seller?: string;
  passportId?: string;
  unitPrice?: string;
  quantity?: string;
  status?: string;
  createdAt?: string;
  updatedAt: string;
  lastEventId: string;
}

interface OfferRow {
  offerId: string;
  listingId?: string;
  buyer?: string;
  quantity?: string;
  totalPrice?: string;
  status?: string;
  placedAt?: string;
  acceptedAt?: string;
  updatedAt: string;
  lastEventId: string;
}

interface CertificationRow {
  eventId: string;
  passportId: string;
  certType?: string;
  issuer?: string;
  certificationHash?: string;
  issuedAt?: string;
  expiresAt?: string;
  occurredAt: string;
  indexedAt: string;
}

function getString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === 'string' ? value : undefined;
}

function toIsoFromUnixSeconds(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  return new Date(numeric * 1000).toISOString();
}

function deriveAggregate(envelope: NormalizedEventEnvelope): { aggregateType: string; aggregateId: string } {
  const payload = envelope.payload;

  if (envelope.contract === 'dpp') {
    return {
      aggregateType: 'passport',
      aggregateId: getString(payload, 'passportId') ?? envelope.id
    };
  }

  if (envelope.eventName === 'ListingCreated') {
    return {
      aggregateType: 'listing',
      aggregateId: getString(payload, 'listingId') ?? envelope.id
    };
  }

  return {
    aggregateType: 'offer',
    aggregateId: getString(payload, 'offerId') ?? envelope.id
  };
}

function buildDppPassportRow(envelope: NormalizedEventEnvelope): DppPassportRow | null {
  const payload = envelope.payload;
  const passportId = getString(payload, 'passportId');
  if (!passportId) {
    return null;
  }

  if (envelope.eventName === 'PassportCreated') {
    return {
      passportId,
      batchId: getString(payload, 'batchId'),
      owner: getString(payload, 'owner'),
      product: getString(payload, 'product'),
      origin: getString(payload, 'origin'),
      active: 1,
      createdAt: toIsoFromUnixSeconds(getString(payload, 'createdAt')),
      updatedAt: envelope.metadata.indexedAt,
      lastEventId: envelope.id
    };
  }

  if (envelope.eventName === 'PassportStatusUpdated') {
    const activeValue = payload.active;
    const active = typeof activeValue === 'boolean' ? (activeValue ? 1 : 0) : undefined;

    return {
      passportId,
      active,
      updatedAt: envelope.metadata.indexedAt,
      lastEventId: envelope.id
    };
  }

  return null;
}

function buildDppTimelineRow(envelope: NormalizedEventEnvelope) {
  const payload = envelope.payload;
  const passportId = getString(payload, 'passportId');
  if (!passportId) {
    return null;
  }

  return {
    eventId: envelope.id,
    passportId,
    eventType: envelope.eventName,
    actor: getString(payload, 'actor') ?? getString(payload, 'updatedBy') ?? getString(payload, 'owner'),
    locationCode: getString(payload, 'locationCode'),
    eventTimestamp:
      toIsoFromUnixSeconds(getString(payload, 'eventTimestamp')) ??
      toIsoFromUnixSeconds(getString(payload, 'updatedAt')) ??
      toIsoFromUnixSeconds(getString(payload, 'createdAt')) ??
      envelope.occurredAt,
    payloadHash: getString(payload, 'payloadHash'),
    occurredAt: envelope.occurredAt,
    indexedAt: envelope.metadata.indexedAt
  };
}

function buildListingRow(envelope: NormalizedEventEnvelope): ListingRow | null {
  if (envelope.eventName !== 'ListingCreated') {
    return null;
  }

  const payload = envelope.payload;
  const listingId = getString(payload, 'listingId');
  if (!listingId) {
    return null;
  }

  return {
    listingId,
    seller: getString(payload, 'seller'),
    passportId: getString(payload, 'passportId'),
    unitPrice: getString(payload, 'unitPrice'),
    quantity: getString(payload, 'quantity'),
    status: 'Open',
    createdAt: toIsoFromUnixSeconds(getString(payload, 'createdAt')),
    updatedAt: envelope.metadata.indexedAt,
    lastEventId: envelope.id
  };
}

function buildOfferRow(envelope: NormalizedEventEnvelope): OfferRow | null {
  const payload = envelope.payload;

  if (envelope.eventName === 'OfferPlaced') {
    const offerId = getString(payload, 'offerId');
    if (!offerId) {
      return null;
    }

    function buildCertificationRow(envelope: NormalizedEventEnvelope): CertificationRow | null {
      if (envelope.eventName !== 'PassportCertificationAttached') {
        return null;
      }

      const payload = envelope.payload;
      const passportId = getString(payload, 'passportId');
      if (!passportId) {
        return null;
      }

      return {
        eventId: envelope.id,
        passportId,
        certType: getString(payload, 'certType'),
        issuer: getString(payload, 'issuer'),
        certificationHash: getString(payload, 'certificationHash'),
        issuedAt: toIsoFromUnixSeconds(getString(payload, 'issuedAt')),
        expiresAt: toIsoFromUnixSeconds(getString(payload, 'expiresAt')),
        occurredAt: envelope.occurredAt,
        indexedAt: envelope.metadata.indexedAt
      };
    }

    return {
      offerId,
      listingId: getString(payload, 'listingId'),
      buyer: getString(payload, 'buyer'),
      quantity: getString(payload, 'quantity'),
      totalPrice: getString(payload, 'totalPrice'),
      status: 'Pending',
      placedAt: toIsoFromUnixSeconds(getString(payload, 'placedAt')),
      updatedAt: envelope.metadata.indexedAt,
      lastEventId: envelope.id
    };
  }

  if (envelope.eventName === 'OfferAccepted') {
    const offerId = getString(payload, 'offerId');
    if (!offerId) {
      return null;
    }

    return {
      offerId,
      listingId: getString(payload, 'listingId'),
      buyer: getString(payload, 'buyer'),
      totalPrice: getString(payload, 'totalPrice'),
      status: 'Accepted',
      acceptedAt: toIsoFromUnixSeconds(getString(payload, 'acceptedAt')),
      updatedAt: envelope.metadata.indexedAt,
      lastEventId: envelope.id
    };
  }

  return null;
}

export class SqliteProjectionStore implements ProjectionStore {
  readonly #dbPath: string;
  #db: Database.Database | null = null;

  constructor(dbPath: string) {
    this.#dbPath = dbPath;
  }

  async init(): Promise<void> {
    await mkdir(dirname(this.#dbPath), { recursive: true });
    this.#db = new Database(this.#dbPath);
    this.#db.pragma('journal_mode = WAL');

    for (const statement of TABLE_DEFINITIONS) {
      this.#db.exec(statement);
    }

    for (const statement of INDEX_DEFINITIONS) {
      this.#db.exec(statement);
    }
  }

  async apply(envelope: NormalizedEventEnvelope): Promise<boolean> {
    const db = this.#db;
    if (!db) {
      throw new Error('SqliteProjectionStore not initialized. Call init() first.');
    }

    const transaction = db.transaction((event: NormalizedEventEnvelope) => {
      const insertedRawEvent = db
        .prepare(
          `INSERT OR IGNORE INTO raw_chain_events (
            event_id, chain_id, contract_address, block_number, block_hash, transaction_hash,
            log_index, contract, event_name, schema_version, occurred_at, indexed_at, payload_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          event.id,
          event.source.chainId,
          event.source.address,
          event.cursor.blockNumber,
          event.cursor.blockHash,
          event.cursor.transactionHash,
          event.cursor.logIndex,
          event.contract,
          event.eventName,
          event.schemaVersion,
          event.occurredAt,
          event.metadata.indexedAt,
          JSON.stringify(event.payload)
        );

      if (insertedRawEvent.changes === 0) {
        return false;
      }

      const aggregate = deriveAggregate(event);
      db.prepare(
        `INSERT INTO domain_events (
          event_id, aggregate_type, aggregate_id, event_name, payload_json, occurred_at, indexed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        event.id,
        aggregate.aggregateType,
        aggregate.aggregateId,
        event.eventName,
        JSON.stringify(event.payload),
        event.occurredAt,
        event.metadata.indexedAt
      );

      if (event.contract === 'dpp') {
        const passport = buildDppPassportRow(event);
        if (passport) {
          db.prepare(
            `INSERT INTO dpp_passports (
              passport_id, batch_id, owner, product, origin, active, created_at, updated_at, last_event_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(passport_id) DO UPDATE SET
              batch_id = COALESCE(excluded.batch_id, dpp_passports.batch_id),
              owner = COALESCE(excluded.owner, dpp_passports.owner),
              product = COALESCE(excluded.product, dpp_passports.product),
              origin = COALESCE(excluded.origin, dpp_passports.origin),
              active = COALESCE(excluded.active, dpp_passports.active),
              created_at = COALESCE(dpp_passports.created_at, excluded.created_at),
              updated_at = excluded.updated_at,
              last_event_id = excluded.last_event_id`
          ).run(
            passport.passportId,
            passport.batchId ?? null,
            passport.owner ?? null,
            passport.product ?? null,
            passport.origin ?? null,
            passport.active ?? null,
            passport.createdAt ?? null,
            passport.updatedAt,
            passport.lastEventId
          );
        }

        const timeline = buildDppTimelineRow(event);
        if (timeline) {
          db.prepare(
            `INSERT OR IGNORE INTO dpp_timeline_events (
              event_id, passport_id, event_type, actor, location_code,
              event_timestamp, payload_hash, occurred_at, indexed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).run(
            timeline.eventId,
            timeline.passportId,
            timeline.eventType,
            timeline.actor ?? null,
            timeline.locationCode ?? null,
            timeline.eventTimestamp,
            timeline.payloadHash ?? null,
            timeline.occurredAt,
            timeline.indexedAt
          );
        }

        const certification = buildCertificationRow(event);
        if (certification) {
          db.prepare(
            `INSERT OR IGNORE INTO dpp_certifications (
              event_id, passport_id, cert_type, issuer, certification_hash,
              issued_at, expires_at, occurred_at, indexed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).run(
            certification.eventId,
            certification.passportId,
            certification.certType ?? null,
            certification.issuer ?? null,
            certification.certificationHash ?? null,
            certification.issuedAt ?? null,
            certification.expiresAt ?? null,
            certification.occurredAt,
            certification.indexedAt
          );
        }
      }

      if (event.contract === 'marketplace') {
        const listing = buildListingRow(event);
        if (listing) {
          db.prepare(
            `INSERT INTO marketplace_listings (
              listing_id, seller, passport_id, unit_price, quantity, status,
              created_at, updated_at, last_event_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(listing_id) DO UPDATE SET
              seller = COALESCE(excluded.seller, marketplace_listings.seller),
              passport_id = COALESCE(excluded.passport_id, marketplace_listings.passport_id),
              unit_price = COALESCE(excluded.unit_price, marketplace_listings.unit_price),
              quantity = COALESCE(excluded.quantity, marketplace_listings.quantity),
              status = COALESCE(excluded.status, marketplace_listings.status),
              created_at = COALESCE(marketplace_listings.created_at, excluded.created_at),
              updated_at = excluded.updated_at,
              last_event_id = excluded.last_event_id`
          ).run(
            listing.listingId,
            listing.seller ?? null,
            listing.passportId ?? null,
            listing.unitPrice ?? null,
            listing.quantity ?? null,
            listing.status ?? null,
            listing.createdAt ?? null,
            listing.updatedAt,
            listing.lastEventId
          );
        }

        const offer = buildOfferRow(event);
        if (offer) {
          db.prepare(
            `INSERT INTO marketplace_offers (
              offer_id, listing_id, buyer, quantity, total_price, status,
              placed_at, accepted_at, updated_at, last_event_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(offer_id) DO UPDATE SET
              listing_id = COALESCE(excluded.listing_id, marketplace_offers.listing_id),
              buyer = COALESCE(excluded.buyer, marketplace_offers.buyer),
              quantity = COALESCE(excluded.quantity, marketplace_offers.quantity),
              total_price = COALESCE(excluded.total_price, marketplace_offers.total_price),
              status = COALESCE(excluded.status, marketplace_offers.status),
              placed_at = COALESCE(excluded.placed_at, marketplace_offers.placed_at),
              accepted_at = COALESCE(excluded.accepted_at, marketplace_offers.accepted_at),
              updated_at = excluded.updated_at,
              last_event_id = excluded.last_event_id`
          ).run(
            offer.offerId,
            offer.listingId ?? null,
            offer.buyer ?? null,
            offer.quantity ?? null,
            offer.totalPrice ?? null,
            offer.status ?? null,
            offer.placedAt ?? null,
            offer.acceptedAt ?? null,
            offer.updatedAt,
            offer.lastEventId
          );
        }
      }

      db.prepare(
        `INSERT INTO indexer_checkpoints (
          stream_key, block_number, block_hash, transaction_hash, log_index, indexed_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(stream_key) DO UPDATE SET
          block_number = excluded.block_number,
          block_hash = excluded.block_hash,
          transaction_hash = excluded.transaction_hash,
          log_index = excluded.log_index,
          indexed_at = excluded.indexed_at`
      ).run(
        event.contract,
        event.cursor.blockNumber,
        event.cursor.blockHash,
        event.cursor.transactionHash,
        event.cursor.logIndex,
        event.metadata.indexedAt
      );

      return true;
    });

    return transaction(envelope);
  }
}
