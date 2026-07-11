import type { NormalizedEventEnvelope } from '../versioning/schema.js';

export interface ProjectionStore {
  init(): Promise<void>;
  apply(envelope: NormalizedEventEnvelope): Promise<boolean>;
}

/**
 * Phase 2M — Circular Procurement Integration.
 *
 * Circular route telemetry is derived from PassportCertificationAttached and
 * recordPassportEvent events via the existing DPP projection pipeline.
 * No new on-chain storage is required.  The CircularDiversionRoute and
 * CircularProcurementMetrics types in @nama/shared describe the off-chain
 * projection shape; the circularService in apps/api derives these from the
 * dpp_certifications and dpp_timeline_events tables already populated by the
 * existing SqliteProjectionStore.
 */
