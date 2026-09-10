import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { TripRequestStatus } from '../api/types';
import * as tripRequestsApi from '../api/trip-requests';
import { useAuthStore } from '../stores/auth-store';

export function useAgencyTripRequests(status?: TripRequestStatus) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const filter = status && status.length > 0 ? status : undefined;
  return useInfiniteQuery({
    queryKey: ['trip-requests', 'agency', filter ?? 'all'],
    queryFn: ({ pageParam }) =>
      tripRequestsApi.listAgencyTripRequests(filter, pageParam, 20, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken,
  });
}

export function useMyTripRequests(status?: TripRequestStatus) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const filter = status && status.length > 0 ? status : undefined;
  return useInfiniteQuery({
    queryKey: ['trip-requests', 'mine', filter ?? 'all'],
    queryFn: ({ pageParam }) =>
      tripRequestsApi.listMyTripRequests(filter, pageParam, 20, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken,
  });
}

export function useTripRequest(tripRequestId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['trip-request', tripRequestId],
    queryFn: () => tripRequestsApi.getTripRequest(tripRequestId, accessToken!),
    enabled: !!accessToken && !!tripRequestId,
  });
}

export function useSmartReplyTemplates() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['smart-reply-templates'],
    queryFn: () => tripRequestsApi.listSmartReplyTemplates(accessToken!),
    enabled: !!accessToken,
  });
}


