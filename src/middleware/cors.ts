import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[]

const DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
const DEFAULT_HEADERS = ['Content-Type', 'Authorization']

export interface CorsOptions {
  origins?: string[]
  methods?: string[]
  headers?: string[]
  credentials?: boolean
}

export function cors(request: NextRequest, options: CorsOptions = {}) {
  const origin = request.headers.get('origin') || ''
  const allowedOrigins = options.origins ?? DEFAULT_ALLOWED_ORIGINS
  const isAllowed = allowedOrigins.includes(origin)

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '*',
    'Vary': 'Origin',
    'Access-Control-Allow-Credentials': String(options.credentials ?? true),
    'Access-Control-Allow-Methods': (options.methods ?? DEFAULT_METHODS).join(', '),
    'Access-Control-Allow-Headers': (options.headers ?? DEFAULT_HEADERS).join(', '),
  }

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers })
  }

  return headers
}
