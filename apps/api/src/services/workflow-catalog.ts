import type { ProducerWorkflowDefinition } from '@nama/shared'

export const WORKFLOW_CATALOG: ProducerWorkflowDefinition[] = [
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
      payloadHash: '0xstd001feedcafe'
    },
    steps: [
      {
        id: 'identity',
        title: 'Batch identity',
        description: 'Capture the core batch identity before lifecycle events begin.',
        fields: [
          { key: 'producerCooperative', label: 'Producer cooperative', type: 'text', required: true },
          { key: 'lotSizeKg', label: 'Lot size (kg)', type: 'number', required: true },
          { key: 'harvestDate', label: 'Harvest date', type: 'date', required: true }
        ]
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
              { label: 'Cold-chain pouch', value: 'cold-chain-pouch' }
            ]
          },
          { key: 'certificationsVerified', label: 'Certification packet verified', type: 'toggle', required: true },
          { key: 'assuranceNotes', label: 'Assurance notes', type: 'textarea', placeholder: 'Optional audit note' }
        ]
      }
    ],
    telemetryTasks: [
      {
        id: 'temperature-check',
        title: 'Cold-chain temperature check',
        metric: 'temperature',
        unit: '°C',
        status: 'verified',
        source: 'sensor',
        guidance: 'Confirm latest sensor reading before dispatch.'
      },
      {
        id: 'nfc-bind',
        title: 'NFC bind verification',
        metric: 'nfc-scan',
        unit: 'event',
        status: 'completed',
        source: 'nfc',
        guidance: 'Simulate wallet-free tag pairing for downstream receivers.'
      }
    ]
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
      payloadHash: '0xaqua001feedbeef'
    },
    steps: [
      {
        id: 'pond-profile',
        title: 'Pond profile',
        description: 'Capture the production unit and species metadata used by the enterprise read views.',
        fields: [
          { key: 'species', label: 'Species', type: 'text', required: true },
          { key: 'pondId', label: 'Pond / cage ID', type: 'text', required: true },
          { key: 'harvestWindow', label: 'Harvest window', type: 'date', required: true }
        ]
      },
      {
        id: 'water-quality',
        title: 'Water quality telemetry',
        description: 'Record verifiable telemetry that stays event-based until dedicated contracts are justified.',
        fields: [
          { key: 'dissolvedOxygenMgL', label: 'Dissolved oxygen (mg/L)', type: 'number', required: true },
          { key: 'salinityPpt', label: 'Salinity (ppt)', type: 'number', required: true },
          { key: 'feedCertification', label: 'Feed certification', type: 'text', required: true }
        ]
      }
    ],
    telemetryTasks: [
      {
        id: 'oxygen-check',
        title: 'Oxygen verification',
        metric: 'dissolved-oxygen',
        unit: 'mg/L',
        status: 'verified',
        source: 'manual',
        guidance: 'Supervisor confirms reading against pond-side meter.'
      },
      {
        id: 'salinity-scan',
        title: 'Salinity telemetry upload',
        metric: 'salinity',
        unit: 'ppt',
        status: 'pending',
        source: 'sensor',
        guidance: 'Pending next gateway sync.'
      }
    ]
  }
]

export function getWorkflowDefinition(workflowId?: string, profile: ProducerWorkflowDefinition['profile'] = 'standard') {
  return (
    WORKFLOW_CATALOG.find((workflow) => workflow.workflowId === workflowId) ??
    WORKFLOW_CATALOG.find((workflow) => workflow.profile === profile) ??
    WORKFLOW_CATALOG[0]
  )
}
