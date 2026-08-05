import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as friendsApi from '../api/friends';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useSendFriendRequest() {
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (addresseeId: string) => friendsApi.sendFriendRequest(addresseeId, requireAccessToken()),
    onSuccess: () => showToast('Friend request sent.'),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (requestId: string) => friendsApi.acceptFriendRequest(requestId, requireAccessToken()),
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
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (requestId: string) => friendsApi.declineFriendRequest(requestId, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['friend-requests'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnfriend() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userId: string) => friendsApi.unfriend(userId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      showToast('Friend removed.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
