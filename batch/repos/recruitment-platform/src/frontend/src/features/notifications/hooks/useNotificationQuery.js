import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import notificationService from '../services/notificationService'
import useNotificationStore from '@app/store/notificationStore'

export const useNotifications = (params = { page: 1, limit: 10, isRead: undefined }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await notificationService.getAll(params)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  const decrement = useNotificationStore((state) => state.decrement)

  return useMutation({
    mutationFn: (id) => notificationService.markRead(id),
    onSuccess: () => {
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      // Notice: don't call decrement() here immediately because the Socket already receives 'notification_read'
      // and calls decrement. But to be safe and avoid double decrement, we rely mainly on socket
      // or we can optimistic update. Currently relying on socket or invalidating is fine.
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      // Socket handles resetting count
    },
  })
}
