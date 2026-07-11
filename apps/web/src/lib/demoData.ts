/**
 * Static seeded demo data for the pre-Testnet unified architecture.
 *
 * Used when the app is running as a static GitHub Pages deploy with no backend
 * (isDemoMode === true). All telemetry, NFC states, and coordinates remain
 * simulated for product demonstration purposes.
 */

import type {
  DPP,
  EnterpriseDashboard,
  InterfaceViewPreset,
  MarketplaceListing,
  ProducerWorkflowDefinition,
  ESGReport,
  IoTReading,
  TelemetrySummary,
} from '@nama/shared'

export const DEMO_BATCH_ID = 'demo-batch-001'
export const AQUA_BATCH_ID = 'aqua-batch-001'

export const interfacePresets: InterfaceViewPreset[] = [
  {
    mode: 'enterprise',
    label: 'Enterprise command center',
    summary: 'Read-only dashboards for ESG, telemetry, audit, procurement, and export readiness.',
    primaryCapabilities: ['ESG intelligence', 'Verified telemetry', 'ERP export gateway', 'AII visibility'],
  },
  {
    mode: 'producer',
    label: 'Producer workspace',
    summary: 'Mobile-first assisted capture for DPP, Aqua-DPP, NFC pairing, and telemetry tasks.',
    primaryCapabilities: ['Metadata workflows', 'Aqua-DPP capture', 'Wallet-light UX', 'NFC simulation'],
  },
]

export const producerWorkflows: ProducerWorkflowDefinition[] = [
  {
    workflowId: 'producer-dpp-standard-v1',
    name: 'Producer DPP Capture',
    profile: 'standard',
    summary: 'Metadata-driven batch capture for terrestrial producers with optional wallet assistance.',
    walletMode: 'wallet-light',
    recommendedMetadataTags: ['harvest', 'certification', 'traceability'],
    nfcSimulation: {
      tagId: 'nfc-demo-standard-001',
      status: 'verified',
      lastScannedAt: '2025-03-20T09:05:00.000Z',
      payloadHash: '0xstd001feedcafe',
    },
    steps: [
      {
        id: 'identity',
        title: 'Batch identity',
        description: 'Capture the core batch identity before lifecycle events begin.',
        fields: [
          { key: 'producerCooperative', label: 'Producer cooperative', type: 'text', required: true },
          { key: 'lotSizeKg', label: 'Lot size (kg)', type: 'number', required: true },
          { key: 'harvestDate', label: 'Harvest date', type: 'date', required: true },
        ],
      },
      {
        id: 'assurance',
        title: 'Assurance metadata',
        description: 'Attach lightweight metadata that can later be promoted to on-chain certification evidence.',
        fields: [
          {
            key: 'packagingType',
            label: 'Packaging type',
            type: 'select',
            required: true,
            options: [
              { label: 'Jute', value: 'jute' },
              { label: 'Reusable crate', value: 'crate' },
              { label: 'Cold-chain pouch', value: 'cold-chain-pouch' },
            ],
          },
          { key: 'certificationsVerified', label: 'Certification packet verified', type: 'toggle', required: true },
          { key: 'assuranceNotes', label: 'Assurance notes', type: 'textarea' },
        ],
      },
    ],
    telemetryTasks: [
      {
        id: 'temperature-check',
        title: 'Cold-chain temperature check',
        metric: 'temperature',
        unit: '°C',
        status: 'verified',
        source: 'sensor',
        guidance: 'Confirm latest sensor reading before dispatch.',
      },
      {
        id: 'nfc-bind',
        title: 'NFC bind verification',
        metric: 'nfc-scan',
        unit: 'event',
        status: 'completed',
        source: 'nfc',
        guidance: 'Simulate wallet-free tag pairing for downstream receivers.',
      },
    ],
  },
  {
    workflowId: 'producer-aqua-dpp-v1',
    name: 'Aqua-DPP Capture',
    profile: 'aqua',
    summary: 'Metadata-first aquaculture flow for pond, feed, and water quality capture without new contracts.',
    walletMode: 'wallet-free-assisted',
    recommendedMetadataTags: ['pond', 'water-quality', 'feed', 'biosecurity'],
    nfcSimulation: {
      tagId: 'nfc-demo-aqua-001',
      status: 'paired',
      lastScannedAt: '2025-03-28T06:45:00.000Z',
      payloadHash: '0xaqua001feedbeef',
    },
    steps: [
      {
        id: 'pond-profile',
        title: 'Pond profile',
        description: 'Capture the production unit and species metadata used by the enterprise read views.',
        fields: [
          { key: 'species', label: 'Species', type: 'text', required: true },
          { key: 'pondId', label: 'Pond / cage ID', type: 'text', required: true },
          { key: 'harvestWindow', label: 'Harvest window', type: 'date', required: true },
        ],
      },
      {
        id: 'water-quality',
        title: 'Water quality telemetry',
        description: 'Record verifiable telemetry that stays event-based until dedicated contracts are justified.',
        fields: [
          { key: 'dissolvedOxygenMgL', label: 'Dissolved oxygen (mg/L)', type: 'number', required: true },
          { key: 'salinityPpt', label: 'Salinity (ppt)', type: 'number', required: true },
          { key: 'feedCertification', label: 'Feed certification', type: 'text', required: true },
        ],
      },
    ],
    telemetryTasks: [
      {
        id: 'oxygen-check',
        title: 'Oxygen verification',
        metric: 'dissolved-oxygen',
        unit: 'mg/L',
        status: 'verified',
        source: 'manual',
        guidance: 'Supervisor confirms reading against pond-side meter.',
      },
      {
        id: 'salinity-scan',
        title: 'Salinity telemetry upload',
        metric: 'salinity',
        unit: 'ppt',
        status: 'pending',
        source: 'sensor',
        guidance: 'Pending next gateway sync.',
      },
    ],
  },
]

export const demoDPP: DPP = {
  dppId: 'demo-dpp-001',
  batchId: DEMO_BATCH_ID,
  product: 'org.coffee.arabica',
  productName: 'Single-Origin Arabica Coffee Beans',
  origin: 'FARM-KE-001',
  originCountry: 'Kenya',
  status: 'active',
  profile: 'standard',
  workflowId: 'producer-dpp-standard-v1',
  workflow: producerWorkflows[0],
  certifications: [
    {
      name: 'Organic',
      issuer: 'Kenya Organic Farmers Association',
      issuedAt: '2025-01-15T00:00:00.000Z',
    },
    {
      name: 'Fair Trade',
      issuer: 'FLO-CERT GmbH',
      issuedAt: '2025-02-01T00:00:00.000Z',
      expiresAt: '2027-02-01T00:00:00.000Z',
    },
  ],
  events: [
    {
      eventType: 'created',
      timestamp: '2025-03-01T06:00:00.000Z',
      actor: 'FARM-KE-001',
      location: 'Nyeri County, Kenya',
      metadata: {
        telemetry: [
          { category: 'biodiversity', value: 1, unit: 'event', sdgGoals: [15], status: 'verified', tags: ['agroforestry'] },
        ],
      },
    },
    {
      eventType: 'transit',
      timestamp: '2025-03-05T10:30:00.000Z',
      actor: 'LOGISTICS-001',
      location: 'Mombasa Port, Kenya',
      metadata: {
        telemetry: [
          { category: 'energy', value: 12.4, unit: 'kWh', sdgGoals: [7, 13], status: 'verified', tags: ['dispatch', 'cold-chain'] },
        ],
      },
    },
    {
      eventType: 'storage',
      timestamp: '2025-03-12T14:00:00.000Z',
      actor: 'WAREHOUSE-AE-001',
      location: 'Dubai, UAE',
      metadata: {
        telemetry: [
          { category: 'waste', value: 2.1, unit: 'kg', sdgGoals: [12], status: 'captured', tags: ['storage-loss'] },
        ],
      },
    },
    {
      eventType: 'quality_check',
      timestamp: '2025-03-20T09:00:00.000Z',
      actor: 'QA-TEAM-001',
      location: 'Dubai, UAE',
      metadata: {
        telemetry: [
          { category: 'compliance', value: 1, unit: 'event', sdgGoals: [12], status: 'verified', tags: ['qa', 'audit'] },
        ],
      },
    },
  ],
  metadata: {
    producerCooperative: 'Nyeri Highlands Cooperative',
    lotSizeKg: 500,
    harvestDate: '2025-02-24',
    packagingType: 'jute',
    certificationsVerified: true,
  },
  createdAt: '2025-03-01T06:00:00.000Z',
}

export const demoAquaDPP: DPP = {
  dppId: 'demo-dpp-aqua-001',
  batchId: AQUA_BATCH_ID,
  product: 'org.shrimp.vannamei',
  productName: 'Vannamei Shrimp Harvest Lot',
  origin: 'POND-ID-009',
  originCountry: 'Indonesia',
  status: 'active',
  profile: 'aqua',
  workflowId: 'producer-aqua-dpp-v1',
  workflow: producerWorkflows[1],
  certifications: [
    {
      name: 'ASC Ready',
      issuer: 'Regional Aqua Assurance Board',
      issuedAt: '2025-03-10T00:00:00.000Z',
    },
  ],
  events: [
    {
      eventType: 'created',
      timestamp: '2025-03-24T05:30:00.000Z',
      actor: 'AQUA-PRODUCER-009',
      location: 'Makassar, Indonesia',
      metadata: {
        telemetry: [
          { category: 'water', value: 7.6, unit: 'pH', sdgGoals: [6, 14], status: 'verified', tags: ['pond-baseline'] },
        ],
      },
    },
    {
      eventType: 'quality_check',
      timestamp: '2025-03-28T06:45:00.000Z',
      actor: 'BIOSECURITY-TEAM-03',
      location: 'Makassar, Indonesia',
      metadata: {
        telemetry: [
          { category: 'water', value: 6.8, unit: 'mg/L', sdgGoals: [6, 14], status: 'verified', tags: ['oxygen'] },
          { category: 'biodiversity', value: 1, unit: 'event', sdgGoals: [14], status: 'captured', tags: ['feed-audit'] },
        ],
      },
    },
  ],
  metadata: {
    species: 'Litopenaeus vannamei',
    pondId: 'POND-ID-009',
    harvestWindow: '2025-04-02',
    dissolvedOxygenMgL: 6.8,
    salinityPpt: 14,
    feedCertification: 'IFFO RS',
  },
  createdAt: '2025-03-24T05:30:00.000Z',
}

export const demoIoTReadings: IoTReading[] = [
  {
    readingId: 'demo-r-001',
    sensorId: 'sensor-temp-001',
    batchId: DEMO_BATCH_ID,
    type: 'temperature',
    value: 22.5,
    unit: '°C',
    timestamp: '2025-03-05T10:30:00.000Z',
  },
  {
    readingId: 'demo-r-002',
    sensorId: 'sensor-hum-001',
    batchId: DEMO_BATCH_ID,
    type: 'humidity',
    value: 58,
    unit: '%',
    timestamp: '2025-03-05T10:30:00.000Z',
  },
  {
    readingId: 'demo-r-003',
    sensorId: 'sensor-temp-001',
    batchId: DEMO_BATCH_ID,
    type: 'temperature',
    value: 28.5,
    unit: '°C',
    timestamp: '2025-03-12T14:00:00.000Z',
  },
  {
    readingId: 'demo-r-004',
    sensorId: 'sensor-hum-001',
    batchId: DEMO_BATCH_ID,
    type: 'humidity',
    value: 85,
    unit: '%',
    timestamp: '2025-03-12T14:00:00.000Z',
  },
  {
    readingId: 'demo-r-005',
    sensorId: 'sensor-temp-001',
    batchId: DEMO_BATCH_ID,
    type: 'temperature',
    value: 21.0,
    unit: '°C',
    timestamp: '2025-03-20T09:00:00.000Z',
  },
  {
    readingId: 'demo-r-006',
    sensorId: 'sensor-hum-001',
    batchId: DEMO_BATCH_ID,
    type: 'humidity',
    value: 62,
    unit: '%',
    timestamp: '2025-03-20T09:00:00.000Z',
  },
]

export const demoMarketplaceListings: MarketplaceListing[] = [
  {
    listingId: 'demo-listing-001',
    dppId: 'demo-dpp-001',
    sellerOrgId: 'FARM-KE-001',
    quantity: 500,
    unitPriceVET: '10',
    currency: 'VET',
    status: 'open',
    createdAt: '2025-03-20T09:00:00.000Z',
  },
]

export const demoESGReport: ESGReport = {
  reportId: 'demo-esg-001',
  orgId: DEMO_BATCH_ID,
  periodStart: '2025-03-01T00:00:00.000Z',
  periodEnd: '2025-03-20T09:00:00.000Z',
  complianceScore: 90,
  carbonFootprintKg: 2.25,
  circularRoutes: 0,
  generatedAt: '2025-03-20T09:00:00.000Z',
  metrics: [
    {
      metricType: 'carbon',
      value: 2.25,
      unit: 'kg CO2e',
      timestamp: '2025-03-20T09:00:00.000Z',
      source: 'simulated',
    },
    {
      metricType: 'compliance',
      value: 90,
      unit: 'score',
      timestamp: '2025-03-20T09:00:00.000Z',
      source: 'simulated',
    },
  ],
}

export const demoTelemetrySummary: TelemetrySummary = {
  batchId: DEMO_BATCH_ID,
  totals: {
    captured: 4,
    verified: 3,
    flagged: 0,
  },
  categories: [
    { category: 'biodiversity', totalValue: 1, unit: 'event', verifiedCount: 1, sdgGoals: [15] },
    { category: 'energy', totalValue: 12.4, unit: 'kWh', verifiedCount: 1, sdgGoals: [7, 13] },
    { category: 'waste', totalValue: 2.1, unit: 'kg', verifiedCount: 0, sdgGoals: [12] },
    { category: 'compliance', totalValue: 1, unit: 'event', verifiedCount: 1, sdgGoals: [12] },
  ],
  recentEvents: [
    {
      id: 'telemetry-1',
      batchId: DEMO_BATCH_ID,
      passportId: 'demo-dpp-001',
      category: 'compliance',
      value: 1,
      unit: 'event',
      status: 'verified',
      sdgGoals: [12],
      source: 'manual',
      capturedAt: '2025-03-20T09:00:00.000Z',
      actor: 'QA-TEAM-001',
      tags: ['qa', 'audit'],
    },
    {
      id: 'telemetry-2',
      batchId: DEMO_BATCH_ID,
      passportId: 'demo-dpp-001',
      category: 'waste',
      value: 2.1,
      unit: 'kg',
      status: 'captured',
      sdgGoals: [12],
      source: 'manual',
      capturedAt: '2025-03-12T14:00:00.000Z',
      actor: 'WAREHOUSE-AE-001',
      tags: ['storage-loss'],
    },
    {
      id: 'telemetry-3',
      batchId: DEMO_BATCH_ID,
      passportId: 'demo-dpp-001',
      category: 'energy',
      value: 12.4,
      unit: 'kWh',
      status: 'verified',
      sdgGoals: [7, 13],
      source: 'manual',
      capturedAt: '2025-03-05T10:30:00.000Z',
      actor: 'LOGISTICS-001',
      tags: ['dispatch', 'cold-chain'],
    },
  ],
}

export const demoEnterpriseDashboard: EnterpriseDashboard = {
  generatedAt: '2025-03-20T09:00:00.000Z',
  source: 'demo',
  stats: {
    activePassports: 2,
    openListings: 1,
    telemetryVerified: 3,
    exportJobs: 6,
  },
  esg: demoESGReport,
  telemetry: demoTelemetrySummary,
  aii: {
    batchId: DEMO_BATCH_ID,
    score: 77,
    grade: 'B',
    calculatedAt: '2025-03-20T09:00:00.000Z',
    certificationScore: 70,
    marketplaceScore: 85,
    breakdown: [
      {
        id: 'certifications',
        label: 'Certification readiness',
        weight: 0.45,
        score: 70,
        rationale: 'Organic and Fair Trade evidence attached to the batch.',
      },
      {
        id: 'marketplace',
        label: 'Marketplace traction',
        weight: 0.35,
        score: 85,
        rationale: 'Listing is live in the procurement feed with verified unit pricing.',
      },
      {
        id: 'telemetry',
        label: 'Telemetry verifiability',
        weight: 0.2,
        score: 60,
        rationale: 'Three telemetry events are already verified for audit review.',
      },
    ],
    evidence: [
      'Organic issued by Kenya Organic Farmers Association',
      'Fair Trade issued by FLO-CERT GmbH',
      'Listing demo-listing-001 open at 10 VET',
    ],
  },
  auditSnapshots: [
    {
      snapshotId: 'audit-1',
      batchId: DEMO_BATCH_ID,
      status: 'attention',
      generatedAt: '2025-03-20T09:00:00.000Z',
      controls: ['Certification-derived AII evidence', 'Projection-backed lifecycle history', 'Event-based SDG telemetry review'],
      findings: ['waste telemetry still awaiting verification'],
      eventCount: 4,
      exportIds: ['passports-csv', 'audit-json'],
    },
    {
      snapshotId: 'audit-2',
      batchId: AQUA_BATCH_ID,
      status: 'verified',
      generatedAt: '2025-03-28T06:45:00.000Z',
      controls: ['Aqua metadata completeness', 'Pond telemetry attestation', 'NFC assisted capture trace'],
      findings: ['No open telemetry exceptions'],
      eventCount: 2,
      exportIds: ['telemetry-json'],
    },
  ],
  exportJobs: [
    { exportId: 'passports-csv', dataset: 'passports', format: 'csv', version: 'v1', status: 'ready', source: 'demo', recordCount: 2, generatedAt: '2025-03-20T09:00:00.000Z', downloadPath: '#' },
    { exportId: 'passports-json', dataset: 'passports', format: 'json', version: 'v1', status: 'generated', source: 'demo', recordCount: 2, generatedAt: '2025-03-20T09:00:00.000Z', downloadPath: '#' },
    { exportId: 'telemetry-csv', dataset: 'telemetry', format: 'csv', version: 'v1', status: 'ready', source: 'demo', recordCount: 3, generatedAt: '2025-03-20T09:00:00.000Z', downloadPath: '#' },
    { exportId: 'telemetry-json', dataset: 'telemetry', format: 'json', version: 'v1', status: 'generated', source: 'demo', recordCount: 3, generatedAt: '2025-03-20T09:00:00.000Z', downloadPath: '#' },
    { exportId: 'audit-csv', dataset: 'audit', format: 'csv', version: 'v1', status: 'ready', source: 'demo', recordCount: 2, generatedAt: '2025-03-20T09:00:00.000Z', downloadPath: '#' },
    { exportId: 'audit-json', dataset: 'audit', format: 'json', version: 'v1', status: 'generated', source: 'demo', recordCount: 2, generatedAt: '2025-03-20T09:00:00.000Z', downloadPath: '#' },
  ],
}

export const demoProducerWorkspace = {
  generatedAt: '2025-03-28T06:45:00.000Z',
  presets: interfacePresets,
  workflows: producerWorkflows,
  passports: [demoDPP, demoAquaDPP],
}
