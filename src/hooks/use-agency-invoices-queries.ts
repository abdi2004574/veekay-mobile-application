import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { listAgencyInvoices, getAgencyInvoice, updateAgencyInvoiceStatus } from "../api/agency-invoices";
import type { AgencyInvoiceItem, AgencyInvoiceListResponse } from "../api/agency-invoices";

export const AGENCY_INVOICE_QUERY_KEYS = {
  all: ["agency-invoices"] as const,
  list: (status: string | undefined, cursor: string | undefined, limit: number) =>
    ["agency-invoices", "list", status, cursor, limit] as const,
  detail: (id: string) => ["agency-invoices", "detail", id] as const,
};

export function useAgencyInvoices(status?: string, cursor?: string, limit = 20) {
  const { accessToken } = useAuthStore();
  return useQuery<AgencyInvoiceListResponse>({
    queryKey: AGENCY_INVOICE_QUERY_KEYS.list(status, cursor, limit),
    queryFn: () => listAgencyInvoices(accessToken ?? "", status, cursor, limit),
    enabled: !!accessToken,
  });
}

export function useAgencyInvoice(id: string) {
  const { accessToken } = useAuthStore();
  return useQuery<AgencyInvoiceItem>({
    queryKey: AGENCY_INVOICE_QUERY_KEYS.detail(id),
    queryFn: () => getAgencyInvoice(accessToken ?? "", id),
    enabled: !!accessToken && !!id,
  });
}

export function useUpdateInvoiceStatus() {
  const { accessToken } = useAuthStore();
  return {
    mutate: (id: string, status: string) =>
      updateAgencyInvoiceStatus(accessToken ?? "", id, status),
  };
}
