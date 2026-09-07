import { apiFetch } from './client';
import type { Page, SmartReplyTemplate, TripRequest, TripRequestStatus } from './types';

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}

export interface CreateTripRequestInput {
  agencyId: string;
  message: string;
  packageId?: string;
  campaignId?: string;
}

export interface SmartReplyTemplateInput {
  title: string;
  body: string;
}

export function createTripRequest(input: CreateTripRequestInput, accessToken: string) {
  return apiFetch<TripRequest>('/trip-requests', {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function listAgencyTripRequests(
  status: TripRequestStatus | undefined,
  cursor: string | undefined,
  limit: number | undefined,
  accessToken: string,
) {
  return apiFetch<Page<TripRequest>>(
    withQuery('/trip-requests', { status, cursor, limit: limit ?? 20 }),
    { accessToken },
  );
}

export function listMyTripRequests(
  status: TripRequestStatus | undefined,
  cursor: string | undefined,
  limit: number | undefined,
  accessToken: string,
) {
  return apiFetch<Page<TripRequest>>(
    withQuery('/trip-requests/mine', { status, cursor, limit: limit ?? 20 }),
    { accessToken },
  );
}

export function getTripRequest(id: string, accessToken: string) {
  return apiFetch<TripRequest>(`/trip-requests/${id}`, { accessToken });
}

export function updateTripRequestStatus(
  id: string,
  status: TripRequestStatus,
  accessToken: string,
) {
  return apiFetch<TripRequest>(`/trip-requests/${id}/status`, {
    method: 'PATCH',
    body: { status },
    accessToken,
  });
}

export function cancelTripRequest(id: string, accessToken: string) {
  return apiFetch<TripRequest>(`/trip-requests/${id}/cancel`, {
    method: 'POST',
    accessToken,
  });
}

export function listSmartReplyTemplates(accessToken: string) {
  return apiFetch<SmartReplyTemplate[]>('/trip-requests/smart-replies/templates', {
    accessToken,
  });
}

export function createSmartReplyTemplate(
  input: SmartReplyTemplateInput,
  accessToken: string,
) {
  return apiFetch<SmartReplyTemplate>('/trip-requests/smart-replies/templates', {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function updateSmartReplyTemplate(
  id: string,
  input: Partial<SmartReplyTemplateInput>,
  accessToken: string,
) {
  return apiFetch<SmartReplyTemplate>(`/trip-requests/smart-replies/templates/${id}`, {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function deleteSmartReplyTemplate(id: string, accessToken: string) {
  return apiFetch<void>(`/trip-requests/smart-replies/templates/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}