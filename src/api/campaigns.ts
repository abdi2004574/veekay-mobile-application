import { apiFetch } from './client';
import type { Campaign, CampaignDetail, CampaignPrivacy, Page } from './types';

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}

export interface CampaignInput {
  title: string;
  destination: string;
  goalAmount: number;
  tripStartDate: string;
  tripEndDate?: string;
  story?: string;
  privacy: CampaignPrivacy;
  giftMode: boolean;
  giftOccasion?: string;
  photoMediaIds: string[];
  itineraryMediaId?: string;
  agencyQuoteMediaId?: string;
}

export function createCampaign(input: CampaignInput, accessToken: string) {
  return apiFetch<Campaign>('/campaigns', { method: 'POST', body: input, accessToken });
}

export function updateCampaign(
  campaignId: string,
  input: Partial<CampaignInput>,
  accessToken: string,
) {
  return apiFetch<Campaign>(`/campaigns/${campaignId}`, {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function deleteCampaign(campaignId: string, accessToken: string) {
  return apiFetch<void>(`/campaigns/${campaignId}`, { method: 'DELETE', accessToken });
}

export function listMyCampaigns(accessToken: string) {
  return apiFetch<Campaign[]>('/campaigns/mine', { accessToken });
}

export function listCampaigns(
  cursor: string | undefined,
  search: string | undefined,
  creatorId: string | undefined,
  accessToken: string,
) {
  return apiFetch<Page<Campaign>>(
    withQuery('/campaigns', { cursor, limit: 20, search: search || undefined, creatorId }),
    { accessToken },
  );
}

export function getCampaign(campaignId: string, accessToken: string) {
  return apiFetch<CampaignDetail>(`/campaigns/${campaignId}`, { accessToken });
}

export function listTopContributors(campaignId: string, accessToken: string) {
  return apiFetch<{ items: unknown[] }>(`/campaigns/${campaignId}/top-contributors`, {
    accessToken,
  });
}
