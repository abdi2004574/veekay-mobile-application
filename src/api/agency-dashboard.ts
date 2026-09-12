import { apiFetch } from './client';
import type { FundingTrendRange } from './types';

export interface KpiResponse {
  totalRequests: number;
  pendingRequests: number;
  inDiscussionRequests: number;
  confirmedRequests: number;
  totalPackages: number;
  totalRevenue: number;
  avgResponseTimeHours: number;
}

export interface FundingTrendPoint {
  date: string;
  amount: number;
}

export interface FundingTrendsResponse {
  trends: FundingTrendPoint[];
}

export interface TopDestination {
  destination: string;
  bookingCount: number;
  totalRevenue: number;
}

export interface TopDestinationsResponse {
  destinations: TopDestination[];
}

export interface TravelerPreference {
  destinationType: string;
  travelerCount: number;
  percentage: number;
}

export interface TravelerPreferencesResponse {
  preferences: TravelerPreference[];
}

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => k + '=' + encodeURIComponent(String(v)))
    .join('&');
  return query ? path + '?' + query : path;
}

export function getKpis(accessToken: string) {
  return apiFetch<KpiResponse>('/agency/dashboard/kpis', { accessToken });
}

export function getFundingTrends(range: FundingTrendRange, accessToken: string) {
  return apiFetch<FundingTrendsResponse>(
    withQuery('/agency/dashboard/funding-trends', { range }),
    { accessToken },
  );
}

export function getTopDestinations(accessToken: string) {
  return apiFetch<TopDestinationsResponse>('/agency/dashboard/top-destinations', { accessToken });
}

export function getTravelerPreferences(accessToken: string) {
  return apiFetch<TravelerPreferencesResponse>('/agency/dashboard/traveler-preferences', { accessToken });
}

export const getDashboardKpis = getKpis;
