import { useEffect, useState } from 'react'
import type { EnterpriseDashboard } from '@nama/shared'
import { apiUrl, isDemoMode } from '../lib/api.ts'
import { demoEnterpriseDashboard } from '../lib/demoData.ts'

export function useEnterpriseDashboard() {
  const [dashboard, setDashboard] = useState<EnterpriseDashboard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      setDashboard(demoEnterpriseDashboard)
      return
    }

    setLoading(true)
    setError(null)

    fetch(apiUrl('/enterprise/dashboard'))
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`)
          })
        }
        return res.json() as Promise<EnterpriseDashboard>
      })
      .then((data) => {
        setDashboard(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load enterprise dashboard')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { dashboard, loading, error }
}
