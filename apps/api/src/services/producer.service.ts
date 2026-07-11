import type { InterfaceViewPreset, ProducerWorkflowDefinition } from '@nama/shared'
import { dppService } from './dpp.service.ts'
import { WORKFLOW_CATALOG } from './workflow-catalog.ts'

interface ProducerWorkspacePayload {
  generatedAt: string
  presets: InterfaceViewPreset[]
  workflows: ProducerWorkflowDefinition[]
  passports: ReturnType<typeof dppService.listAll>
}

const PRESETS: InterfaceViewPreset[] = [
  {
    mode: 'enterprise',
    label: 'Enterprise command center',
    summary: 'Read-only dashboards for ESG, audit, telemetry, procurement, and export readiness.',
    primaryCapabilities: ['ESG intelligence', 'Smart procurement', 'Audit snapshots', 'ERP exports']
  },
  {
    mode: 'producer',
    label: 'Producer workspace',
    summary: 'Mobile-first assisted capture for DPP, Aqua-DPP, NFC pairing, and telemetry verification.',
    primaryCapabilities: ['Metadata-driven DPP', 'Aqua-DPP capture', 'NFC simulation', 'Telemetry tasks']
  }
]

class ProducerService {
  getWorkspace(): ProducerWorkspacePayload {
    return {
      generatedAt: new Date().toISOString(),
      presets: PRESETS,
      workflows: WORKFLOW_CATALOG,
      passports: dppService.listAll()
    }
  }
}

export const producerService = new ProducerService()
