import type { RawEventLog } from '../connectors/types.js';
import type { DecodedEvent } from '../decoders/decode-event.js';
import { buildPayload } from '../handlers/index.js';
import {
  NORMALIZED_EVENT_SCHEMA_VERSION,
  type NormalizedEventEnvelope
} from '../versioning/schema.js';

function serialize(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item));
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
      key,
      serialize(nested)
    ]);

    return Object.fromEntries(entries);
  }

  return value;
}

function readOccurredAtFromPayload(payload: Record<string, unknown>): string | null {
  const timestampFields = ['createdAt', 'updatedAt', 'eventTimestamp', 'placedAt', 'acceptedAt'];

  for (const field of timestampFields) {
    const value = payload[field];
    if (typeof value !== 'string') {
      continue;
    }

    const timestamp = Number(value);
    if (!Number.isFinite(timestamp)) {
      continue;
    }

    return new Date(timestamp * 1000).toISOString();
  }

  return null;
}

export function toNormalizedEnvelope(log: RawEventLog, decoded: DecodedEvent): NormalizedEventEnvelope {
  const payload = serialize(buildPayload(decoded)) as Record<string, unknown>;
  const occurredAt = readOccurredAtFromPayload(payload) ?? new Date().toISOString();
  const indexedAt = occurredAt;

  return {
    id: `${log.blockHash}:${log.logIndex}`,
    schemaVersion: NORMALIZED_EVENT_SCHEMA_VERSION,
    contract: decoded.contract,
    eventName: decoded.eventName,
    source: {
      chainId: log.chainId,
      address: log.address
    },
    cursor: {
      blockNumber: log.blockNumber.toString(),
      blockHash: log.blockHash,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex
    },
    occurredAt,
    payload,
    metadata: {
      indexedAt
    }
  };
}
