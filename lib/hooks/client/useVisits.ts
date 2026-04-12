import { useQuery } from '@tanstack/react-query'
import { getDocuments, getDocument, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import { sortByField } from '@/lib/query-helpers'
import type { Visit } from '@/lib/types'

export function useVisits(clientId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.visits.byClient(clientId ?? ''),
    queryFn: () =>
      getDocuments<Visit>('visits', where('clientId', '==', clientId)),
    select: sortByField<Visit>('scheduledDate', 'desc'),
    enabled: !!clientId,
  })
}

export function useVisit(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.visits.detail(id ?? ''),
    queryFn: () => getDocument<Visit>('visits', id!),
    enabled: !!id,
  })
}
