import { useState, useEffect } from 'react'
import type { ESGReport } from '@nama/shared'
import { apiUrl, isDemoMode } from '../lib/api.ts'
import { demoESGReport, DEMO_BATCH_ID } from '../lib/demoData.ts'

export function useESG(orgId: string | null) {
  const [report, setReport] = useState<ESGReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orgId) return

    // In GitHub Pages demo mode return seeded data immediately
    if (isDemoMode) {
      if (orgId === DEMO_BATCH_ID) {
        setReport(demoESGReport)
      } else {
        setError(`Demo mode: only "${DEMO_BATCH_ID}" is available offline.`)
      }
      return
    }

    setLoading(true)
    setError(null)
    setReport(null)

    fetch(apiUrl(`/esg/report/${encodeURIComponent(orgId)}`))
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`)
          })
        }
        return res.json() as Promise<ESGReport>
      })
      .then((data) => {
        setReport(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load ESG report')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orgId])

  return { report, loading, error }
}
