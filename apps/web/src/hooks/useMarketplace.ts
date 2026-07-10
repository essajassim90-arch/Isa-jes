import { useState, useEffect } from 'react'
import type { MarketplaceListing } from '@nama/shared'
import { apiUrl } from '../lib/api.ts'

interface ListingsResponse {
  listings: MarketplaceListing[]
  total: number
}

export function useMarketplace() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = () => {
    setLoading(true)
    setError(null)

    fetch(apiUrl('/marketplace/listings'))
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body: { error?: string }) => {
            throw new Error(body.error ?? `HTTP ${res.status}`)
          })
        }
        return res.json() as Promise<ListingsResponse>
      })
      .then((data) => {
        setListings(data.listings)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load listings')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchListings()
  }, [])

  return { listings, loading, error, refetch: fetchListings }
}
