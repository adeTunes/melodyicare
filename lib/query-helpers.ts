import { Timestamp } from 'firebase/firestore'

type SortDirection = 'asc' | 'desc'

/**
 * Returns a TanStack Query `select` function that sorts items by a field.
 *
 * This is used instead of Firestore's `orderBy` when combined with `where`
 * clauses to avoid requiring a composite index for every query. We filter
 * server-side and sort client-side.
 *
 * Supports:
 * - Firestore Timestamp objects (uses `.toMillis()`)
 * - ISO date strings (e.g. '2026-04-08')
 * - Numeric values
 *
 * @example
 * useQuery({
 *   queryFn: () => getDocuments<User>('users', where('role', '==', 'client')),
 *   select: sortByField<User>('createdAt', 'desc'),
 * })
 */
export function sortByField<T>(
  field: keyof T,
  direction: SortDirection = 'desc',
): (items: T[]) => T[] {
  return (items: T[]): T[] => {
    return [...items].sort((a, b) => {
      const aMs = toMillis(a[field])
      const bMs = toMillis(b[field])
      return direction === 'desc' ? bMs - aMs : aMs - bMs
    })
  }
}

function toMillis(value: unknown): number {
  if (value == null) return 0
  if (value instanceof Timestamp) return value.toMillis()
  if (typeof value === 'object' && 'toMillis' in value && typeof (value as Timestamp).toMillis === 'function') {
    return (value as Timestamp).toMillis()
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  if (typeof value === 'number') return value
  return 0
}
