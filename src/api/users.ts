import { apiFetch } from './client';
import type { MeProfile, PublicProfile, TravelerSearchResult } from './types';

export function getMe(accessToken: string) {
  return apiFetch<MeProfile>('/me', { accessToken });
}

export function getUserProfile(userId: string, accessToken: string) {
  return apiFetch<PublicProfile>(`/users/${userId}/profile`, { accessToken });
}

export function searchTravelers(query: string, accessToken: string) {
  return apiFetch<TravelerSearchResult[]>(
    `/users/search?q=${encodeURIComponent(query)}`,
    { accessToken },
  );
}
