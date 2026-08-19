import { useQuery } from '@tanstack/react-query';
import * as groupCampaignsApi from '../api/group-campaigns';
import { useAuthStore } from '../stores/auth-store';

export function useGroupOverview(campaignId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['group-campaign', campaignId, 'overview'],
    queryFn: () => groupCampaignsApi.getGroupOverview(campaignId, accessToken!),
    enabled: !!accessToken && !!campaignId,
  });
}

export function useGroupMembers(campaignId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['group-campaign', campaignId, 'members'],
    queryFn: () => groupCampaignsApi.listGroupMembers(campaignId, accessToken!),
    enabled: !!accessToken && !!campaignId,
  });
}

export function useGroupContributions(campaignId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['group-campaign', campaignId, 'contributions'],
    queryFn: () => groupCampaignsApi.listGroupContributions(campaignId, accessToken!),
    enabled: !!accessToken && !!campaignId,
  });
}

export function useGroupExpenses(campaignId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['group-campaign', campaignId, 'expenses'],
    queryFn: () => groupCampaignsApi.listGroupExpenses(campaignId, accessToken!),
    enabled: !!accessToken && !!campaignId,
  });
}

export function useMyGroupTrips() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['group-trips', 'mine'],
    queryFn: () => groupCampaignsApi.listMyGroupTrips(accessToken!),
    enabled: !!accessToken,
  });
}
