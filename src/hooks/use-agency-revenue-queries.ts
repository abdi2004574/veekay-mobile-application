import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import * as agencyRevenueApi from "../api/agency-revenue";
import { useAuthStore } from "../stores/auth-store";

export function useRevenueLedger(cursor?: string, limit?: number) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["agency", "revenue", "ledger", cursor],
    queryFn: () => agencyRevenueApi.getRevenueLedger(accessToken!, cursor, limit),
    enabled: !!accessToken,
  });
}

export function useInfiniteRevenueLedger(limit = 20) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ["agency", "revenue", "ledger", "infinite"],
    queryFn: ({ pageParam }) => agencyRevenueApi.getRevenueLedger(accessToken!, pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken,
  });
}

export function useExportRevenueCsv() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["agency", "revenue", "export"],
    queryFn: () => agencyRevenueApi.exportRevenueCsv(accessToken!),
    enabled: false,
  });
}
