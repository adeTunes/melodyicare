import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, getDocument, where } from '@/lib/firebase/firestore'
import { sortByField } from '@/lib/query-helpers'
import type { CarePlan } from '@/lib/types'

export function useCaregiverCarePlans(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.carePlans.byCaregiver(caregiverId ?? ''),
    queryFn: () =>
      getDocuments<CarePlan>('carePlans', where('caregiverId', '==', caregiverId)),
    select: sortByField<CarePlan>('createdAt', 'desc'),
    enabled: !!caregiverId,
  })
}

export function useCarePlan(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.carePlans.detail(id ?? ''),
    queryFn: () => getDocument<CarePlan>('carePlans', id!),
    enabled: !!id,
  })
}
