import { apiFetch } from './client';
import type { FriendRequest, FriendUser } from './types';

export function sendFriendRequest(addresseeId: string, accessToken: string) {
  return apiFetch<FriendRequest>('/friend-requests', {
    method: 'POST',
    body: { addresseeId },
    accessToken,
  });
}

export function acceptFriendRequest(requestId: string, accessToken: string) {
  return apiFetch<FriendRequest>(`/friend-requests/${requestId}/accept`, {
    method: 'POST',
    accessToken,
  });
}

export function declineFriendRequest(requestId: string, accessToken: string) {
  return apiFetch<FriendRequest>(`/friend-requests/${requestId}/decline`, {
    method: 'POST',
    accessToken,
  });
}

export function listIncomingFriendRequests(accessToken: string) {
  return apiFetch<FriendRequest[]>('/friend-requests', { accessToken });
}

export function listFriends(accessToken: string) {
  return apiFetch<FriendUser[]>('/friends', { accessToken });
}

export function unfriend(userId: string, accessToken: string) {
  return apiFetch<void>(`/friends/${userId}`, { method: 'DELETE', accessToken });
}
