import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificationsApi from '../api/notifications';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useMarkRead() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(requireAccessToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(requireAccessToken(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: { type: string; inAppEnabled?: boolean; pushEnabled?: boolean; emailEnabled?: boolean }) =>
      notificationsApi.updatePreference(requireAccessToken(), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useRegisterDevice() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: { fcmToken: string; platform: 'ios' | 'android' | 'web' }) =>
      notificationsApi.registerDevice(requireAccessToken(), input.fcmToken, input.platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'devices'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnregisterDevice() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (token: string) => notificationsApi.unregisterDevice(requireAccessToken(), token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'devices'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}