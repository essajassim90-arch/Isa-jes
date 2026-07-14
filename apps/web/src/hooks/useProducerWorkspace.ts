import { useEffect, useState } from 'react'
import type { DPP, InterfaceViewPreset, ProducerWorkflowDefinition } from '@nama/shared'
import { apiUrl, isDemoMode } from '../lib/api.ts'
import { demoProducerWorkspace } from '../lib/demoData.ts'

interface ProducerWorkspaceResponse {
  generatedAt: string
  presets: InterfaceViewPreset[]
  workflows: ProducerWorkflowDefinition[]
  passports: DPP[]
}

export function useProducerWorkspace() {
  const [workspace, setWorkspace] = useState<ProducerWorkspaceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      setWorkspace(demoProducerWorkspace)
      return
    }

    setLoading(true)
    setError(null)

    fetch(apiUrl('/producer/workspace'))
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`)
          })
        }
        return res.json() as Promise<ProducerWorkspaceResponse>
      })
      .then((data) => {
        setWorkspace(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load producer workspace')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { workspace, loading, error }
}
