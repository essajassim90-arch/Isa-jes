import { decodeEventLog } from 'viem';
import type { Hex } from 'viem';
import type { RawEventLog } from '../connectors/types.js';
import type { SupportedContract, SupportedEventName } from '../versioning/schema.js';
import { DPP_EVENTS_ABI, MARKETPLACE_EVENTS_ABI } from './abis.js';

interface DecodedEventBase {
  contract: SupportedContract;
  eventName: SupportedEventName;
  args: Record<string, unknown>;
}

const DPP_EVENT_NAMES = new Set<SupportedEventName>([
  'PassportCreated',
  'PassportStatusUpdated',
  'PassportEventRecorded'
]);

const MARKETPLACE_EVENT_NAMES = new Set<SupportedEventName>([
  'ListingCreated',
  'OfferPlaced',
  'OfferAccepted'
]);

export function decodeSupportedEvent(log: RawEventLog): DecodedEventBase | null {
  if (log.topics.length === 0) {
    return null;
  }
  const topics = log.topics as [Hex, ...Hex[]];

  const abi = log.contract === 'dpp' ? DPP_EVENTS_ABI : MARKETPLACE_EVENTS_ABI;

  try {
    const decoded = decodeEventLog({
      abi,
      data: log.data,
      topics,
      strict: true
    });

    if (!isSupportedEvent(log.contract, decoded.eventName)) {
      return null;
    }

    return {
      contract: log.contract,
      eventName: decoded.eventName,
      args: decoded.args as Record<string, unknown>
    };
  } catch {
    return null;
  }
}

function isSupportedEvent(contract: SupportedContract, eventName: string): eventName is SupportedEventName {
  if (contract === 'dpp') {
    return DPP_EVENT_NAMES.has(eventName as SupportedEventName);
  }

  return MARKETPLACE_EVENT_NAMES.has(eventName as SupportedEventName);
}

export type DecodedEvent = NonNullable<ReturnType<typeof decodeSupportedEvent>>;
