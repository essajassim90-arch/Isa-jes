import { useState, useEffect } from 'react'
import type { CircularPanel } from '@nama/shared'
import { apiUrl, isDemoMode } from '../lib/api.ts'
import { demoCircularPanel } from '../lib/demoData.ts'

export function useCircular() {
  const [panel, setPanel] = useState<CircularPanel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPanel = () => {
    if (isDemoMode) {
      setPanel(demoCircularPanel)
      return
    }

    setLoading(true)
    setError(null)

    fetch(apiUrl('/circular/panel'))
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`)
          })
        }
        return res.json() as Promise<CircularPanel>
      })
      .then((data) => {
        setPanel(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load circular panel')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPanel()
  }, [])

  return { panel, loading, error, refetch: fetchPanel }
}
