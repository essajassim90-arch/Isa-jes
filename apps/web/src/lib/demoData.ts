/**
 * Static seeded demo data for Phase 1 MVP Demo.
 *
 * Used when the app is running as a static GitHub Pages deploy with no backend
 * (isDemoMode === true). All coordinates are simulated shipment waypoints — no
 * real-world location data is captured or stored.
 *
 * Privacy note:
 *  - No personal data is required for this demo.
 *  - IoT readings are fully simulated.
 *  - Coordinates are mock shipment waypoints, not real device locations.
 *  - No phone data, photos, audio, email, private keys, or seed phrases are used.
 */

import type {
  DPP,
  MarketplaceListing,
  ESGReport,
  IoTReading,
} from '@nama/shared'

export const DEMO_BATCH_ID = 'demo-batch-001'

export const demoDPP: DPP = {
  dppId: 'demo-dpp-001',
  batchId: DEMO_BATCH_ID,
  product: 'org.coffee.arabica',
  productName: 'Single-Origin Arabica Coffee Beans',
  origin: 'FARM-KE-001',
  originCountry: 'Kenya',
  status: 'active',
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
    },
    {
      eventType: 'transit',
      timestamp: '2025-03-05T10:30:00.000Z',
      actor: 'LOGISTICS-001',
      location: 'Mombasa Port, Kenya',
    },
    {
      eventType: 'storage',
      timestamp: '2025-03-12T14:00:00.000Z',
      actor: 'WAREHOUSE-AE-001',
      location: 'Dubai, UAE',
    },
    {
      eventType: 'quality_check',
      timestamp: '2025-03-20T09:00:00.000Z',
      actor: 'QA-TEAM-001',
      location: 'Dubai, UAE',
    },
  ],
  createdAt: '2025-03-01T06:00:00.000Z',
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
