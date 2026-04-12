import { useQuery } from '@tanstack/react-query'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import { sortByField } from '@/lib/query-helpers'
import type { FAQEntry } from '@/lib/types'

export function useFAQEntries() {
  return useQuery({
    queryKey: queryKeys.faq.all(),
    queryFn: () =>
      getDocuments<FAQEntry>('faqEntries', where('isPublished', '==', true)),
    select: sortByField<FAQEntry>('order', 'asc'),
  })
}
