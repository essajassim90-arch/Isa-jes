import type { DecodedEvent } from '../decoders/decode-event.js';
import { buildDppPayload } from './dpp.js';
import { buildMarketplacePayload } from './marketplace.js';

export function buildPayload(decoded: DecodedEvent): Record<string, unknown> {
  if (decoded.contract === 'dpp') {
    return buildDppPayload(decoded);
  }

  return buildMarketplacePayload(decoded);
}
