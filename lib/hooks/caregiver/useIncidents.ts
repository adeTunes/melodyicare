import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, getDocument, where } from '@/lib/firebase/firestore'
import { sortByField } from '@/lib/query-helpers'
import type { Incident } from '@/lib/types'

export function useCaregiverIncidents(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.incidents.byCaregiver(caregiverId ?? ''),
    queryFn: () =>
      getDocuments<Incident>('incidents', where('caregiverId', '==', caregiverId)),
    select: sortByField<Incident>('createdAt', 'desc'),
    enabled: !!caregiverId,
  })
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.incidents.detail(id ?? ''),
    queryFn: () => getDocument<Incident>('incidents', id!),
    enabled: !!id,
  })
}
