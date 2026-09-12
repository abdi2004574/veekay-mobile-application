import { apiFetch } from "./client";
import type { AgencyDirectoryEntry, Page } from "./types";

export interface AgencyDetail extends AgencyDirectoryEntry {
  payoutAccount: {
    bankName: string;
    accountHolderName: string;
    maskedAccount: string;
    accountType: string;
    routingNumber: string;
    lastUpdated: string;
    status: "verified" | "pending" | "unverified";
  } | null;
  subscriptionTier: "basic" | "premium" | "featured";
  commissionRate: number;
  stripeAccountId: string | null;
}

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => k + "=" + encodeURIComponent(String(v)))
    .join("&");
  return query ? path + "?" + query : path;
}

export function listAgencies(
  cursor: string | undefined,
  search: string | undefined,
  accessToken: string,
) {
  return apiFetch<Page<AgencyDirectoryEntry>>(
    withQuery("/agencies", { cursor, limit: 20, search: search || undefined }),
    { accessToken },
  );
}

export function getAgency(agencyId: string, accessToken: string) {
  return apiFetch<AgencyDirectoryEntry>("/agencies/" + agencyId, { accessToken });
}

export function getMyAgency(accessToken: string) {
  return apiFetch<AgencyDetail>("/agencies/me", { accessToken });
}
