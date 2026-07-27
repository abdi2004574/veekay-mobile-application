import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as reviewsApi from '../api/reviews';
import { useAuthStore } from '../stores/auth-store';

export function useAgencyReviews(agencyId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ['agency-reviews', agencyId],
    queryFn: ({ pageParam }) => reviewsApi.listAgencyReviews(agencyId, pageParam, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken && !!agencyId,
  });
}

export function useMyReviews() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.listMyReviews(accessToken!),
    enabled: !!accessToken,
  });
}
