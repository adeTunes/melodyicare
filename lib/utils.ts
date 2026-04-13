import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from 'firebase/firestore'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a Firestore field to a JS Date.
 * Handles Timestamp objects, Date objects, ISO strings,
 * and serverTimestamp sentinels (returns null).
 */
export function safeDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Timestamp) return value.toDate()
  if (value instanceof Date) return value
  if (typeof value === 'string') return new Date(value)
  if (typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate()
  }
  // serverTimestamp sentinel or unknown shape
  if (typeof value === 'object' && '_methodName' in (value as Record<string, unknown>)) return null
  if (typeof value === 'object' && 'seconds' in (value as Record<string, unknown>)) {
    const v = value as { seconds: number; nanoseconds?: number }
    return new Date(v.seconds * 1000)
  }
  return null
}

/**
 * Format a Firestore timestamp-like value for display.
 * Returns a fallback string if the value can't be converted.
 */
export function formatTimestamp(value: unknown, locale = 'en-NG', options?: Intl.DateTimeFormatOptions): string {
  const date = safeDate(value)
  if (!date || isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(locale, options)
}
