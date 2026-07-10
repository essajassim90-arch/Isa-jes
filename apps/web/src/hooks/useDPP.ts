import { useState, useEffect } from 'react'
import type { DPP } from '@nama/shared'

// TODO (Phase 1): Replace mock with real API call to GET /dpp/:batchId.
export function useDPP(batchId: string | null) {
  const [dpp, setDpp] = useState<DPP | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!batchId) return
    setLoading(true)
    setError(null)

    // Mock — swap for: fetch(`/api/dpp/${batchId}`)
    setTimeout(() => {
      setDpp({
        batchId,
        origin: 'Mock Farm, Kenya',
        product: 'Organic Coffee Beans',
        status: 'active',
        certifications: [],
        events: [],
        createdAt: new Date().toISOString(),
      })
      setLoading(false)
    }, 500)
  }, [batchId])

  return { dpp, loading, error }
}
