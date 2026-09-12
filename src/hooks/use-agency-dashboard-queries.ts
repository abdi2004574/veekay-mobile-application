import { useQuery } from '@tanstack/react-query';
import * as agencyDashboardApi from '../api/agency-dashboard';
import { useAuthStore } from '../stores/auth-store';
import type { FundingTrendRange } from '../api/types';

export function useAgencyKpis() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['agency', 'kpis'],
    queryFn: () => agencyDashboardApi.getKpis(accessToken!),
    enabled: !!accessToken,
  });
}

export function useFundingTrends(range: FundingTrendRange) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['agency', 'funding-trends', range],
    queryFn: () => agencyDashboardApi.getFundingTrends(range, accessToken!),
    enabled: !!accessToken,
  });
}

export function useTopDestinations() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['agency', 'top-destinations'],
    queryFn: () => agencyDashboardApi.getTopDestinations(accessToken!),
    enabled: !!accessToken,
  });
}

export function useTravelerPreferences() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['agency', 'traveler-preferences'],
    queryFn: () => agencyDashboardApi.getTravelerPreferences(accessToken!),
    enabled: !!accessToken,
  });
}
