import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Read response body safely: prefers JSON if content-type indicates,
// otherwise returns text without throwing HTML into JSON.parse.
export async function readBodySafe(res) {
  const ct = res.headers?.get?.('content-type') || ''
  const isJson = ct.includes('application/json')
  try {
    return isJson ? await res.json() : await res.text()
  } catch (_) {
    // If parsing fails, fall back to text so UI can show a useful error
    try { return await res.text() } catch { return null }
  }
}

// Extract a human-friendly error message from a body (json or text)
export function extractError(body, fallback = 'Request failed') {
  if (typeof body === 'string') {
    const trimmed = body.trim()
    if (!trimmed) return fallback
    if (trimmed.startsWith('<')) return 'Server returned HTML instead of JSON (wrong endpoint)'
    return trimmed
  }
  return body?.error || body?.message || fallback
}
