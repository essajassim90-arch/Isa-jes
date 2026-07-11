import type { AbiEvent } from 'viem';

export const DPP_EVENTS_ABI = [
  {
    type: 'event',
    name: 'PassportCreated',
    inputs: [
      { name: 'passportId', type: 'bytes32', indexed: true },
      { name: 'batchId', type: 'string', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'product', type: 'string', indexed: false },
      { name: 'origin', type: 'string', indexed: false },
      { name: 'createdAt', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'PassportStatusUpdated',
    inputs: [
      { name: 'passportId', type: 'bytes32', indexed: true },
      { name: 'updatedBy', type: 'address', indexed: true },
      { name: 'previousActive', type: 'bool', indexed: false },
      { name: 'active', type: 'bool', indexed: false },
      { name: 'updatedAt', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'PassportEventRecorded',
    inputs: [
      { name: 'passportId', type: 'bytes32', indexed: true },
      { name: 'eventType', type: 'bytes32', indexed: true },
      { name: 'actor', type: 'address', indexed: true },
      { name: 'locationCode', type: 'string', indexed: false },
      { name: 'eventTimestamp', type: 'uint256', indexed: false },
      { name: 'payloadHash', type: 'string', indexed: false }
    ],
    anonymous: false
  }
] as const satisfies readonly AbiEvent[];

export const MARKETPLACE_EVENTS_ABI = [
  {
    type: 'event',
    name: 'ListingCreated',
    inputs: [
      { name: 'listingId', type: 'bytes32', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'passportId', type: 'bytes32', indexed: true },
      { name: 'unitPrice', type: 'uint256', indexed: false },
      { name: 'quantity', type: 'uint256', indexed: false },
      { name: 'createdAt', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OfferPlaced',
    inputs: [
      { name: 'offerId', type: 'bytes32', indexed: true },
      { name: 'listingId', type: 'bytes32', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'quantity', type: 'uint256', indexed: false },
      { name: 'totalPrice', type: 'uint256', indexed: false },
      { name: 'placedAt', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OfferAccepted',
    inputs: [
      { name: 'offerId', type: 'bytes32', indexed: true },
      { name: 'listingId', type: 'bytes32', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'buyer', type: 'address', indexed: false },
      { name: 'totalPrice', type: 'uint256', indexed: false },
      { name: 'acceptedAt', type: 'uint256', indexed: false }
    ],
    anonymous: false
  }
] as const satisfies readonly AbiEvent[];
