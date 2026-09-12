import { apiFetch } from './client';

export interface RevenueLedgerItem {
  bookingId: string;
  packageId: string;
  packageTitle: string;
  travelerId: string;
  travelerEmail: string;
  amount: number;
  commission: number;
  netPayout: number;
  status: string;
  completedAt: string;
}

export interface RevenueLedgerResponse {
  items: RevenueLedgerItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function getRevenueLedger(accessToken: string, cursor?: string, limit?: number) {
  const params: Record<string, string | number | undefined> = {};
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => k + '=' + encodeURIComponent(String(v)))
    .join('&');
  const path = query ? '/agency/revenue/ledger?' + query : '/agency/revenue/ledger';
  return apiFetch<RevenueLedgerResponse>(path, { accessToken });
}

export function exportRevenueCsv(accessToken: string) {
  return apiFetch<Blob>('/agency/revenue/export', {
    method: 'GET',
    accessToken,
  });
}
