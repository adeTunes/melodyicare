import { useQuery } from '@tanstack/react-query'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import { sortByField } from '@/lib/query-helpers'
import type { UserDocument } from '@/lib/types'

export function useDocuments(ownerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.documents.byOwner(ownerId ?? ''),
    queryFn: () =>
      getDocuments<UserDocument>('documents', where('ownerId', '==', ownerId)),
    select: sortByField<UserDocument>('uploadedAt', 'desc'),
    enabled: !!ownerId,
  })
}
