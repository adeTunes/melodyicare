import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, getDocument, where } from '@/lib/firebase/firestore'
import { sortByField } from '@/lib/query-helpers'
import type { Visit } from '@/lib/types'

export function useCaregiverVisits(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.visits.byCaregiver(caregiverId ?? ''),
    queryFn: () =>
      getDocuments<Visit>('visits', where('caregiverId', '==', caregiverId)),
    select: sortByField<Visit>('scheduledDate', 'desc'),
    enabled: !!caregiverId,
  })
}

export function useCaregiverUpcomingVisits(caregiverId: string | undefined) {
  const today = new Date().toISOString().split('T')[0]
  return useQuery({
    queryKey: [...queryKeys.visits.byCaregiver(caregiverId ?? ''), 'upcoming'],
    queryFn: () =>
      getDocuments<Visit>('visits', where('caregiverId', '==', caregiverId)),
    select: (visits: Visit[]) =>
      [...visits]
        .filter((v) => (v.scheduledDate ?? '') >= today)
        .sort((a, b) => (a.scheduledDate ?? '').localeCompare(b.scheduledDate ?? '')),
    enabled: !!caregiverId,
  })
}

export function useVisit(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.visits.detail(id ?? ''),
    queryFn: () => getDocument<Visit>('visits', id!),
    enabled: !!id,
  })
}
