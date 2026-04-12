import { useQuery } from '@tanstack/react-query'
import { getDocument } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import type { CaregiverProfile, User } from '@/lib/types'

export function useCaregiverProfile(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.caregiverProfiles.detail(caregiverId ?? ''),
    queryFn: () => getDocument<CaregiverProfile>('caregiverProfiles', caregiverId!),
    enabled: !!caregiverId,
  })
}

export function useCaregiverUser(caregiverId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(caregiverId ?? ''),
    queryFn: () => getDocument<User>('users', caregiverId!),
    enabled: !!caregiverId,
  })
}
