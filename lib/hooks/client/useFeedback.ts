import { useQuery } from '@tanstack/react-query'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import { sortByField } from '@/lib/query-helpers'
import type { Feedback } from '@/lib/types'

export function useFeedbackByClient(clientId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.feedback.byClient(clientId ?? ''),
    queryFn: () =>
      getDocuments<Feedback>('feedback', where('clientId', '==', clientId)),
    select: sortByField<Feedback>('createdAt', 'desc'),
    enabled: !!clientId,
  })
}

export function useFeedbackByVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.feedback.byVisit(visitId ?? ''),
    queryFn: () =>
      getDocuments<Feedback>('feedback', where('visitId', '==', visitId)),
    enabled: !!visitId,
  })
}
