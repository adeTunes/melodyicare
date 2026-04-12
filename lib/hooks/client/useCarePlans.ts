import { useQuery } from '@tanstack/react-query'
import { getDocuments, getDocument, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import { sortByField } from '@/lib/query-helpers'
import type { CarePlan } from '@/lib/types'

export function useCarePlans(clientId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.carePlans.byClient(clientId ?? ''),
    queryFn: () =>
      getDocuments<CarePlan>('carePlans', where('clientId', '==', clientId)),
    select: sortByField<CarePlan>('createdAt', 'desc'),
    enabled: !!clientId,
  })
}

export function useCarePlan(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.carePlans.detail(id ?? ''),
    queryFn: () => getDocument<CarePlan>('carePlans', id!),
    enabled: !!id,
  })
}
