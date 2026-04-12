import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { sortByField } from '@/lib/query-helpers'
import type { VitalsLog } from '@/lib/types'

export function useVitalsByVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vitals.byVisit(visitId ?? ''),
    queryFn: () =>
      getDocuments<VitalsLog>('vitals', where('visitId', '==', visitId)),
    select: sortByField<VitalsLog>('recordedAt', 'desc'),
    enabled: !!visitId,
  })
}
