import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as notificationsApi from '../api/notifications';
import { useAuthStore } from '../stores/auth-store';


export function useNotifications(options?: { type?: string; cursor?: string; limit?: number }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['notifications', options],
    queryFn: () => notificationsApi.listNotifications(accessToken!, options),
    enabled: !!accessToken,
  });
}

export function useUnreadCount() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(accessToken!),
    enabled: !!accessToken,
  });
}

export function useNotificationPreferences() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: () => notificationsApi.getPreferences(accessToken!),
    enabled: !!accessToken,
  });
}

export function useNotificationDevices() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['notifications', 'devices'],
    queryFn: () => notificationsApi.listDevices(accessToken!),
    enabled: !!accessToken,
  });
}

export function usePrefetchNotifications() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };
}
