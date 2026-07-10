import { useState, useEffect } from 'react'
import type { ESGReport } from '@nama/shared'

// TODO (Phase 1): Replace mock with real API call to GET /esg/report/:orgId.
export function useESG(orgId: string | null) {
  const [report, setReport] = useState<ESGReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    setError(null)

    // Mock — swap for: fetch(`/api/esg/report/${orgId}`)
    setTimeout(() => {
      setReport({
        orgId,
        carbonFootprintKg: 1240.5,
        circularRoutes: 7,
        complianceScore: 82,
        generatedAt: new Date().toISOString(),
      })
      setLoading(false)
    }, 500)
  }, [orgId])

  return { report, loading, error }
}
