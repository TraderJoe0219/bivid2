import { NextRequest } from 'next/server'

// Simple in-memory rate limiter per IP and route
// Note: For multi-instance deployments, replace with Redis or Upstash.
const buckets = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitOptions {
  windowMs: number
  max: number
}

export function getClientKey(req: NextRequest) {
  // Trust x-forwarded-for (Vercel) else use ip from request
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || (req.ip as string) || 'unknown'
  const url = new URL(req.url)
  return `${ip}:${url.pathname}`
}

export function rateLimit(req: NextRequest, options: RateLimitOptions) {
  const key = getClientKey(req)
  const now = Date.now()
  const windowMs = options.windowMs
  const max = options.max

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs }
  }

  if (bucket.count < max) {
    bucket.count += 1
    return { allowed: true, remaining: max - bucket.count, resetAt: bucket.resetAt }
  }

  return { allowed: false, remaining: 0, resetAt: bucket.resetAt }
}
