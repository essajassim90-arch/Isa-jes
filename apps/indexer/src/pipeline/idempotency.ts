import type { NormalizedEventEnvelope } from '../versioning/schema.js';

export class IdempotencyGuard {
  readonly #seen = new Set<string>();

  shouldProcess(envelope: NormalizedEventEnvelope): boolean {
    if (this.#seen.has(envelope.id)) {
      return false;
    }

    this.#seen.add(envelope.id);
    return true;
  }
}
