import { apiFetch } from './client';
import type {
  NotificationListItem,
  NotificationPreferenceItem,
  PushDevice,
  UnreadCountResponse,
} from './types';

export function listNotifications(
  accessToken: string,
  options?: { type?: string; cursor?: string; limit?: number },
) {
  const params = new URLSearchParams();
  if (options?.type) params.set('type', options.type);
  if (options?.cursor) params.set('cursor', options.cursor);
  if (options?.limit) params.set('limit', String(options.limit));

  const query = params.toString();
  return apiFetch<{ items: NotificationListItem[]; nextCursor: string | null }>(
    `/notifications${query ? `?${query}` : ''}`,
    { accessToken },
  );
}

export function getUnreadCount(accessToken: string) {
  return apiFetch<UnreadCountResponse>('/notifications/unread-count', { accessToken });
}

export function markRead(accessToken: string, id: string) {
  return apiFetch<NotificationListItem>(`/notifications/${id}/read`, {
    method: 'PATCH',
    accessToken,
  });
}

export function markAllRead(accessToken: string) {
  return apiFetch<{ count: number }>('/notifications/read-all', {
    method: 'POST',
    accessToken,
  });
}

export function deleteNotification(accessToken: string, id: string) {
  return apiFetch<void>(`/notifications/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function getPreferences(accessToken: string) {
  return apiFetch<NotificationPreferenceItem[]>('/notifications/preferences', { accessToken });
}

export function updatePreference(
  accessToken: string,
  input: { type: string; inAppEnabled?: boolean; pushEnabled?: boolean; emailEnabled?: boolean },
) {
  return apiFetch<NotificationPreferenceItem>('/notifications/preferences', {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function registerDevice(accessToken: string, fcmToken: string, platform: 'ios' | 'android' | 'web') {
  return apiFetch<PushDevice>('/notifications/devices', {
    method: 'POST',
    body: { fcmToken, platform },
    accessToken,
  });
}

export function listDevices(accessToken: string) {
  return apiFetch<PushDevice[]>('/notifications/devices', { accessToken });
}

export function unregisterDevice(accessToken: string, token: string) {
  return apiFetch<void>(`/notifications/devices/${encodeURIComponent(token)}`, {
    method: 'DELETE',
    accessToken,
  });
}
