import { useCallback, useMemo } from 'react';
import { notificationService } from '../services/api';
import { useApi, useMutation } from './useApi';

export function useNotifications(userId?: string) {
  const notificationsQuery = useApi(
    async () => {
      if (!userId) return [];
      return notificationService.getNotifications(userId);
    },
    [userId],
    { immediate: Boolean(userId) }
  );

  const markAsReadMutation = useMutation((notificationId: string) =>
    notificationService.markAsRead(notificationId)
  );

  const markAllAsReadMutation = useMutation((uid: string) =>
    notificationService.markAllAsRead(uid)
  );

  const deleteMutation = useMutation((notificationId: string) =>
    notificationService.deleteNotification(notificationId)
  );

  const notifications = notificationsQuery.data || [];

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      await markAsReadMutation.mutate(notificationId);
      await notificationsQuery.refetch();
    },
    [markAsReadMutation, notificationsQuery]
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    await markAllAsReadMutation.mutate(userId);
    await notificationsQuery.refetch();
  }, [markAllAsReadMutation, notificationsQuery, userId]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      await deleteMutation.mutate(notificationId);
      await notificationsQuery.refetch();
    },
    [deleteMutation, notificationsQuery]
  );

  return {
    notifications,
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    refetch: notificationsQuery.refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isMutating:
      markAsReadMutation.isLoading ||
      markAllAsReadMutation.isLoading ||
      deleteMutation.isLoading,
  };
}

export default useNotifications;
