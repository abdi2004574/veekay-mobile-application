import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { getPopularPackages } from "../api/agency-dashboard";

export const POPULAR_PACKAGES_QUERY_KEY = ["popular-packages"] as const;

export function usePopularPackages() {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: POPULAR_PACKAGES_QUERY_KEY,
    queryFn: () => getPopularPackages(accessToken ?? ""),
    enabled: !!accessToken,
  });
}
