import { apiFetch } from './client';
import type {
  DestinationType,
  Page,
  Package,
  PackageStatus,
} from './types';

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}

export interface PackageInput {
  title: string;
  description?: string;
  basePrice: number;
  currency: string;
  destinationType?: DestinationType;
  season?: string;
  theme?: string;
  itinerary?: string;
  status?: PackageStatus;
  mediaMediaIds?: string[];
}

export function createPackage(input: PackageInput, accessToken: string) {
  return apiFetch<Package>('/packages', { method: 'POST', body: input, accessToken });
}

export function updatePackage(
  packageId: string,
  input: Partial<PackageInput>,
  accessToken: string,
) {
  return apiFetch<Package>(`/packages/${packageId}`, {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function deletePackage(packageId: string, accessToken: string) {
  return apiFetch<void>(`/packages/${packageId}`, { method: 'DELETE', accessToken });
}

export function listMyPackages(accessToken: string) {
  return apiFetch<Package[]>('/packages/mine', { accessToken });
}

export function listPackages(
  cursor: string | undefined,
  destinationType: DestinationType | undefined,
  season: string | undefined,
  theme: string | undefined,
  accessToken: string,
) {
  return apiFetch<Page<Package>>(
    withQuery('/packages', {
      cursor,
      limit: 20,
      destinationType,
      season,
      theme,
    }),
    { accessToken },
  );
}

export function getPackage(packageId: string, accessToken: string) {
  return apiFetch<Package>(`/packages/${packageId}`, { accessToken });
}

export function linkPackageToCampaign(
  packageId: string,
  campaignId: string,
  accessToken: string,
) {
  return apiFetch<void>(
    `/packages/${packageId}/campaigns/${campaignId}/link`,
    { method: 'POST', accessToken },
  );
}

export function unlinkPackageFromCampaign(
  packageId: string,
  campaignId: string,
  accessToken: string,
) {
  return apiFetch<void>(
    `/packages/${packageId}/campaigns/${campaignId}/link`,
    { method: 'DELETE', accessToken },
  );
}