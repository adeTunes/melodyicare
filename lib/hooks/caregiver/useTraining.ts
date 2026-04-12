import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { sortByField } from '@/lib/query-helpers'
import type { TrainingResource } from '@/lib/types'

export function useTrainingResources() {
  return useQuery({
    queryKey: queryKeys.training.all(),
    queryFn: () =>
      getDocuments<TrainingResource>('training', where('isPublished', '==', true)),
    select: sortByField<TrainingResource>('createdAt', 'desc'),
  })
}
