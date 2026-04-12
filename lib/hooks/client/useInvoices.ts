import { useQuery } from '@tanstack/react-query'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import { sortByField } from '@/lib/query-helpers'
import type { Invoice } from '@/lib/types'

export function useInvoices(clientId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.invoices.byClient(clientId ?? ''),
    queryFn: () =>
      getDocuments<Invoice>('invoices', where('clientId', '==', clientId)),
    select: sortByField<Invoice>('createdAt', 'desc'),
    enabled: !!clientId,
  })
}
