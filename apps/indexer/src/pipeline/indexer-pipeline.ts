import type { RawEventLog } from '../connectors/types.js';
import { decodeSupportedEvent } from '../decoders/decode-event.js';
import { CheckpointStore } from '../checkpoints/checkpoint-store.js';
import type { NormalizedEventEnvelope } from '../versioning/schema.js';
import { IdempotencyGuard } from './idempotency.js';
import { toNormalizedEnvelope } from './normalize.js';

export interface IndexerPipelineOptions {
  checkpointStore: CheckpointStore;
  idempotencyGuard?: IdempotencyGuard;
}

export class IndexerPipeline {
  readonly #checkpointStore: CheckpointStore;
  readonly #idempotencyGuard: IdempotencyGuard;

  constructor(options: IndexerPipelineOptions) {
    this.#checkpointStore = options.checkpointStore;
    this.#idempotencyGuard = options.idempotencyGuard ?? new IdempotencyGuard();
  }

  async process(log: RawEventLog): Promise<NormalizedEventEnvelope | null> {
    if (log.removed) {
      return null;
    }

    const decoded = decodeSupportedEvent(log);
    if (!decoded) {
      return null;
    }

    const envelope = toNormalizedEnvelope(log, decoded);
    if (!this.#idempotencyGuard.shouldProcess(envelope)) {
      return null;
    }

    await this.#checkpointStore.set(decoded.contract, envelope);

    return envelope;
  }
}
