import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as friendsApi from '../api/friends';
import { useAuthStore } from '../stores/auth-store';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

function useToken() {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) throw new Error('Not authenticated');
  return accessToken;
}

export function useSendFriendRequest() {
  const accessToken = useToken();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (addresseeId: string) => friendsApi.sendFriendRequest(addresseeId, accessToken),
    onSuccess: () => showToast('Friend request sent.'),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useAcceptFriendRequest() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (requestId: string) => friendsApi.acceptFriendRequest(requestId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      showToast('Friend request accepted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeclineFriendRequest() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (requestId: string) => friendsApi.declineFriendRequest(requestId, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friend-requests'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnfriend() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userId: string) => friendsApi.unfriend(userId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      showToast('Friend removed.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
