import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as campaignsApi from '../api/campaigns';
import { useAuthStore } from '../stores/auth-store';

/** Public browse/search — used by Explore and by "view this traveler's campaigns". */
export function useCampaignDirectory(search: string, creatorId?: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ['campaigns', 'public', search, creatorId],
    queryFn: ({ pageParam }) =>
      campaignsApi.listCampaigns(pageParam, search, creatorId, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken,
  });
}

export function useMyCampaigns() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['campaigns', 'mine'],
    queryFn: () => campaignsApi.listMyCampaigns(accessToken!),
    enabled: !!accessToken,
  });
}

export function useCampaign(campaignId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => campaignsApi.getCampaign(campaignId, accessToken!),
    enabled: !!accessToken && !!campaignId,
  });
}

// Always resolves to { items: [] } until Payments/Donations (#6) ships —
// wired for real now so nothing changes on the mobile side once it does.
export function useTopContributors(campaignId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['campaign', campaignId, 'top-contributors'],
    queryFn: () => campaignsApi.listTopContributors(campaignId, accessToken!),
    enabled: !!accessToken && !!campaignId,
  });
}
