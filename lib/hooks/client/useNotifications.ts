import { useQuery } from '@tanstack/react-query'
import { getDocuments, where } from '@/lib/firebase/firestore'
import { queryKeys } from '@/lib/query-keys'
import { sortByField } from '@/lib/query-helpers'
import type { Notification } from '@/lib/types'

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.notifications.byUser(userId ?? ''),
    queryFn: () =>
      getDocuments<Notification>('notifications', where('userId', '==', userId)),
    select: sortByField<Notification>('createdAt', 'desc'),
    enabled: !!userId,
  })
}

export function useUnreadNotificationCount(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.notifications.unread(userId ?? ''),
    queryFn: async () => {
      const notifications = await getDocuments<Notification>(
        'notifications',
        where('userId', '==', userId),
        where('isRead', '==', false)
      )
      return notifications.length
    },
    enabled: !!userId,
  })
}
