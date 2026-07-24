import { useQuery } from '@tanstack/react-query';
import * as friendsApi from '../api/friends';
import { useAuthStore } from '../stores/auth-store';

export function useFriends() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['friends'],
    queryFn: () => friendsApi.listFriends(accessToken!),
    enabled: !!accessToken,
  });
}

export function useIncomingFriendRequests() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['friend-requests', 'incoming'],
    queryFn: () => friendsApi.listIncomingFriendRequests(accessToken!),
    enabled: !!accessToken,
  });
}
