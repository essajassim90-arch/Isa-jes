import { useState, useEffect } from 'react'
import type { DPP } from '@nama/shared'
import { apiUrl, isDemoMode } from '../lib/api.ts'
import { demoDPP, DEMO_BATCH_ID } from '../lib/demoData.ts'

export function useDPP(batchId: string | null) {
  const [dpp, setDpp] = useState<DPP | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!batchId) return

    // In GitHub Pages demo mode return seeded data immediately
    if (isDemoMode) {
      if (batchId === DEMO_BATCH_ID) {
        setDpp(demoDPP)
      } else {
        setError(`Demo mode: only "${DEMO_BATCH_ID}" is available offline.`)
      }
      return
    }

    setLoading(true)
    setError(null)
    setDpp(null)

    fetch(apiUrl(`/dpp/${encodeURIComponent(batchId)}`))
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`)
          })
        }
        return res.json() as Promise<DPP>
      })
      .then((data) => {
        setDpp(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load DPP')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [batchId])

  return { dpp, loading, error }
}
