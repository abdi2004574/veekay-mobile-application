import { useQuery } from '@tanstack/react-query';
import * as usersApi from '../api/users';
import { useAuthStore } from '../stores/auth-store';

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.getMe(accessToken!),
    enabled: !!accessToken,
  });
}

export function useUserProfile(userId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => usersApi.getUserProfile(userId, accessToken!),
    enabled: !!accessToken && !!userId,
  });
}

export function useSearchTravelers(query: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['traveler-search', query],
    queryFn: () => usersApi.searchTravelers(query, accessToken!),
    enabled: !!accessToken && query.trim().length > 0,
  });
}

export function useNotificationPreferences() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => usersApi.getNotificationPreferences(accessToken!),
    enabled: !!accessToken,
  });
}

export function usePrivacySettings() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['privacy-settings'],
    queryFn: () => usersApi.getPrivacySettings(accessToken!),
    enabled: !!accessToken,
  });
}
