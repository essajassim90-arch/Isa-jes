/**
 * API utility — Phase 1D.
 * In development the vite dev-server proxies /api/* → http://localhost:3001/*.
 * For production set VITE_API_URL=https://your-api/api (no trailing slash).
 */
const API_BASE: string = (import.meta.env['VITE_API_URL'] as string | undefined) ?? '/api'

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`
}
