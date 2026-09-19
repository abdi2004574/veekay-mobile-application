import { apiFetch } from "./client";

export interface AgencyInvoiceItem {
  id: string;
  agencyId: string;
  tripRequestId?: string;
  amount: number;
  currency: string;
  commissionAmount: number;
  netAmount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AgencyInvoiceListResponse {
  items: AgencyInvoiceItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function listAgencyInvoices(
  accessToken: string,
  status?: string,
  cursor?: string,
  limit?: number,
) {
  const params: Record<string, string | number | undefined> = {};
  if (status) params.status = status;
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => k + "=" + encodeURIComponent(String(v)))
    .join("&");
  const path = query
    ? "/agency/invoices?" + query
    : "/agency/invoices";
  return apiFetch<AgencyInvoiceListResponse>(path, { accessToken });
}

export function getAgencyInvoice(accessToken: string, id: string) {
  return apiFetch<AgencyInvoiceItem>("/agency/invoices/" + id, { accessToken });
}

export function updateAgencyInvoiceStatus(
  accessToken: string,
  id: string,
  status: string,
) {
  return apiFetch<AgencyInvoiceItem>("/agency/invoices/" + id + "/status", {
    method: "PATCH",
    body: { status },
    accessToken,
  });
}
