import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { getCalculatePrice } from "../api/agency-dashboard";

export const CALCULATE_PRICE_QUERY_KEY = (packageId: string, fundraisingPercentage: number) =>
  ["calculate-price", packageId, fundraisingPercentage] as const;

export function useCalculatePrice(packageId: string, fundraisingPercentage: number) {
  const { accessToken } = useAuthStore();
  return useQuery({
    queryKey: CALCULATE_PRICE_QUERY_KEY(packageId, fundraisingPercentage),
    queryFn: () => getCalculatePrice(accessToken ?? "", packageId, fundraisingPercentage),
    enabled: !!accessToken && !!packageId,
  });
}
