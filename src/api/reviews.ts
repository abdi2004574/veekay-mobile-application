import { apiFetch } from './client';
import type { AgencyReview, MyReview, Page } from './types';

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}

export interface ReviewInput {
  rating: number;
  body?: string;
}

export function createReview(agencyId: string, input: ReviewInput, accessToken: string) {
  return apiFetch<AgencyReview>(`/agencies/${agencyId}/reviews`, {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function listAgencyReviews(
  agencyId: string,
  cursor: string | undefined,
  accessToken: string,
) {
  return apiFetch<Page<AgencyReview>>(
    withQuery(`/agencies/${agencyId}/reviews`, { cursor, limit: 20 }),
    { accessToken },
  );
}

export function updateReview(
  reviewId: string,
  input: Partial<ReviewInput>,
  accessToken: string,
) {
  return apiFetch<AgencyReview>(`/reviews/${reviewId}`, {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function deleteReview(reviewId: string, accessToken: string) {
  return apiFetch<void>(`/reviews/${reviewId}`, { method: 'DELETE', accessToken });
}

export function listMyReviews(accessToken: string) {
  return apiFetch<MyReview[]>('/reviews/mine', { accessToken });
}
