import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getDocuments, where } from '@/lib/firebase/firestore'
import type { Availability } from '@/lib/types'

export function useCaregiverAvailability(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.availability.byCaregiver(caregiverId ?? ''),
    queryFn: async () => {
      const docs = await getDocuments<Availability>(
        'availability',
        where('caregiverId', '==', caregiverId)
      )
      return docs[0] ?? null
    },
    enabled: !!caregiverId,
  })
}
