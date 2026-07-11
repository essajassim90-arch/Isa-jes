export const NORMALIZED_EVENT_SCHEMA_VERSION = 'phase2c.v1';

export type SupportedContract = 'dpp' | 'marketplace';

export type SupportedEventName =
  | 'PassportCreated'
  | 'PassportStatusUpdated'
  | 'PassportCertificationAttached'
  | 'PassportEventRecorded'
  | 'ListingCreated'
  | 'OfferPlaced'
  | 'OfferAccepted';

export interface NormalizedEventEnvelope {
  id: string;
  schemaVersion: typeof NORMALIZED_EVENT_SCHEMA_VERSION;
  contract: SupportedContract;
  eventName: SupportedEventName;
  source: {
    chainId: number;
    address: string;
  };
  cursor: {
    blockNumber: string;
    blockHash: string;
    transactionHash: string;
    logIndex: number;
  };
  occurredAt: string;
  payload: Record<string, unknown>;
  metadata: {
    indexedAt: string;
  };
}
