export const TABLE_DEFINITIONS = [
  `CREATE TABLE IF NOT EXISTS raw_chain_events (
    event_id TEXT PRIMARY KEY,
    chain_id INTEGER NOT NULL,
    contract_address TEXT NOT NULL,
    block_number TEXT NOT NULL,
    block_hash TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    log_index INTEGER NOT NULL,
    contract TEXT NOT NULL,
    event_name TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    indexed_at TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
  `CREATE TABLE IF NOT EXISTS domain_events (
    event_id TEXT PRIMARY KEY,
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    indexed_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(event_id) REFERENCES raw_chain_events(event_id)
  );`,
  `CREATE TABLE IF NOT EXISTS dpp_passports (
    passport_id TEXT PRIMARY KEY,
    batch_id TEXT,
    owner TEXT,
    product TEXT,
    origin TEXT,
    active INTEGER,
    created_at TEXT,
    updated_at TEXT,
    last_event_id TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS dpp_timeline_events (
    event_id TEXT PRIMARY KEY,
    passport_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    actor TEXT,
    location_code TEXT,
    event_timestamp TEXT,
    payload_hash TEXT,
    occurred_at TEXT NOT NULL,
    indexed_at TEXT NOT NULL,
    FOREIGN KEY(event_id) REFERENCES raw_chain_events(event_id)
  );`,
  `CREATE TABLE IF NOT EXISTS dpp_certifications (
    event_id TEXT PRIMARY KEY,
    passport_id TEXT NOT NULL,
    cert_type TEXT,
    issuer TEXT,
    certification_hash TEXT,
    issued_at TEXT,
    expires_at TEXT,
    occurred_at TEXT NOT NULL,
    indexed_at TEXT NOT NULL,
    FOREIGN KEY(event_id) REFERENCES raw_chain_events(event_id)
  );`,
  `CREATE TABLE IF NOT EXISTS marketplace_listings (
    listing_id TEXT PRIMARY KEY,
    seller TEXT,
    passport_id TEXT,
    unit_price TEXT,
    quantity TEXT,
    status TEXT,
    created_at TEXT,
    updated_at TEXT,
    last_event_id TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS marketplace_offers (
    offer_id TEXT PRIMARY KEY,
    listing_id TEXT,
    buyer TEXT,
    quantity TEXT,
    total_price TEXT,
    status TEXT,
    placed_at TEXT,
    accepted_at TEXT,
    updated_at TEXT,
    last_event_id TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS indexer_checkpoints (
    stream_key TEXT PRIMARY KEY,
    block_number TEXT NOT NULL,
    block_hash TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    log_index INTEGER NOT NULL,
    indexed_at TEXT NOT NULL
  );`
] as const;

export const INDEX_DEFINITIONS = [
  `CREATE INDEX IF NOT EXISTS idx_raw_chain_events_cursor ON raw_chain_events (block_number, log_index);`,
  `CREATE INDEX IF NOT EXISTS idx_domain_events_aggregate ON domain_events (aggregate_type, aggregate_id);`,
  `CREATE INDEX IF NOT EXISTS idx_dpp_timeline_passport ON dpp_timeline_events (passport_id, event_timestamp);`,
  `CREATE INDEX IF NOT EXISTS idx_dpp_certifications_passport ON dpp_certifications (passport_id, issued_at);`,
  `CREATE INDEX IF NOT EXISTS idx_marketplace_offers_listing ON marketplace_offers (listing_id);`
] as const;
