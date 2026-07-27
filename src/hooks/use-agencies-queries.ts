import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as agenciesApi from '../api/agencies';
import { useAuthStore } from '../stores/auth-store';

export function useAgencyDirectory(search: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ['agencies', search],
    queryFn: ({ pageParam }) => agenciesApi.listAgencies(pageParam, search, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken,
  });
}

export function useAgency(agencyId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['agency', agencyId],
    queryFn: () => agenciesApi.getAgency(agencyId, accessToken!),
    enabled: !!accessToken && !!agencyId,
  });
}
