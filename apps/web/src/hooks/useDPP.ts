import { useState, useEffect } from 'react'
import type { DPP } from '@nama/shared'
import { apiUrl } from '../lib/api.ts'

export function useDPP(batchId: string | null) {
  const [dpp, setDpp] = useState<DPP | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!batchId) return
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
