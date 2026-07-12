import type { DecodedEvent } from '../decoders/decode-event.js';

export function buildDppPayload(decoded: DecodedEvent): Record<string, unknown> {
  if (decoded.contract !== 'dpp') {
    return {};
  }

  return decoded.args;
}
