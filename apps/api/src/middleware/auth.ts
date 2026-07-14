import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

function getJwtSecret(): string {
  const secret = process.env['JWT_SECRET']
  if (secret) return secret
  // Only allow an insecure fallback during local development (NODE_ENV=development).
  // In any other environment (production, staging, demo) fail fast to prevent
  // accidentally running with no real secret.
  if (process.env['NODE_ENV'] === 'development') {
    console.warn(
      '[auth] WARNING: JWT_SECRET is not set. Using a local-dev-only fallback. ' +
        'Set JWT_SECRET in your environment before staging or production deployments.',
    )
    return 'local-dev-only-insecure-fallback'
  }
  throw new Error('JWT_SECRET environment variable is required in non-development environments.')
}

const JWT_SECRET = getJwtSecret()

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' })
    return
  }
  const token = authHeader.slice(7)
  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
