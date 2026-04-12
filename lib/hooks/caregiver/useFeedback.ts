import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { sortByField } from '@/lib/query-helpers'
import type { Feedback } from '@/lib/types'

export function useCaregiverFeedback(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.feedback.byCaregiver(caregiverId ?? ''),
    queryFn: () =>
      getDocuments<Feedback>('feedback', where('caregiverId', '==', caregiverId)),
    select: sortByField<Feedback>('createdAt', 'desc'),
    enabled: !!caregiverId,
  })
}
