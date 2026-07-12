import type { DecodedEvent } from '../decoders/decode-event.js';

export function buildMarketplacePayload(decoded: DecodedEvent): Record<string, unknown> {
  if (decoded.contract !== 'marketplace') {
    return {};
  }

  return decoded.args;
}
