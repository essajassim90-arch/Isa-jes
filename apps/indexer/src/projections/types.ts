import type { NormalizedEventEnvelope } from '../versioning/schema.js';

export interface ProjectionStore {
  init(): Promise<void>;
  apply(envelope: NormalizedEventEnvelope): Promise<boolean>;
}
