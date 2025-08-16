// Simple, dependency-free input sanitization utilities
// Note: For rich HTML content, consider integrating isomorphic-dompurify.

export function sanitizeString(input: string): string {
  // Remove script tags and potentially dangerous attributes
  const withoutScripts = input.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
  // Remove on* event handlers and javascript: URLs
  const withoutEvents = withoutScripts.replace(/ on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/ on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/ javascript:\s*/gi, '')
  return withoutEvents.trim()
}

export function sanitizeInput<T = any>(value: T): T {
  if (value == null) return value
  if (typeof value === 'string') return sanitizeString(value) as unknown as T
  if (Array.isArray(value)) return value.map(sanitizeInput) as unknown as T
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeInput(v as any)
    }
    return out as T
  }
  return value
}
