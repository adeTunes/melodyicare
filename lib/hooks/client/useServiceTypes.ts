import { useQuery } from '@tanstack/react-query'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import type { ServiceType } from '@/lib/types'

export function useServiceTypes() {
  return useQuery({
    queryKey: queryKeys.serviceTypes.all(),
    queryFn: () =>
      getDocuments<ServiceType>(
        'serviceTypes',
        where('isActive', '==', true)
      ),
  })
}
