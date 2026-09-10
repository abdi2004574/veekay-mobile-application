import { apiFetch } from './client';
import type {
  DestinationType,
  Gender,
  MeProfile,
  PrivacySettings,
  PublicProfile,
  TravelStyle,
  TravelerSearchResult,
} from './types';

export function getMe(accessToken: string) {
  return apiFetch<MeProfile>('/me', { accessToken });
}

export interface UpdateProfileInput {
  displayName?: string;
  username?: string;
  photoMediaId?: string;
  bio?: string;
  location?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  destinationTypes?: DestinationType[];
  travelStyles?: TravelStyle[];
}

export function updateProfile(input: UpdateProfileInput, accessToken: string) {
  return apiFetch<MeProfile>('/me/profile', { method: 'PATCH', body: input, accessToken });
}

export function getPrivacySettings(accessToken: string) {
  return apiFetch<PrivacySettings>('/me/privacy-settings', { accessToken });
}

export function updatePrivacySettings(input: Partial<PrivacySettings>, accessToken: string) {
  return apiFetch<PrivacySettings>('/me/privacy-settings', {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function deactivateAccount(accessToken: string) {
  return apiFetch<void>('/me', { method: 'DELETE', accessToken });
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
