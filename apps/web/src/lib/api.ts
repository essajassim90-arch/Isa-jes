/**
 * API utility — Phase 1 MVP Demo.
 *
 * Resolution order:
 *  1. VITE_API_URL is explicitly set → use that base URL (live backend).
 *  2. Production build without VITE_API_URL → DEMO MODE: frontend uses local
 *     seeded data; no live API calls are made (safe for GitHub Pages).
 *  3. Development server without VITE_API_URL → fall back to /api which the
 *     Vite dev-server proxies to http://localhost:3001.
 *
 * For production set VITE_API_URL=https://your-api/api (no trailing slash).
 */

const explicitApiUrl = import.meta.env['VITE_API_URL'] as string | undefined

/** True when running as a static GitHub Pages build with no backend. */
export const isDemoMode: boolean = !explicitApiUrl && import.meta.env.PROD

const API_BASE: string = explicitApiUrl ?? '/api'

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`
}
