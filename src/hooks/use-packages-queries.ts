import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { DestinationType } from '../api/types';
import * as packagesApi from '../api/packages';
import { useAuthStore } from '../stores/auth-store';

export function useMyPackages() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['packages', 'mine'],
    queryFn: () => packagesApi.listMyPackages(accessToken!),
    enabled: !!accessToken,
  });
}

export function usePackageDirectory(params: {
  destinationType?: DestinationType;
  season?: string;
  theme?: string;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { destinationType, season, theme } = params;
  return useInfiniteQuery({
    queryKey: ['packages', 'public', destinationType, season, theme],
    queryFn: ({ pageParam }) =>
      packagesApi.listPackages(pageParam, destinationType, season, theme, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken,
  });
}

export function usePackage(packageId: string, options?: { enabled?: boolean }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['package', packageId],
    queryFn: () => packagesApi.getPackage(packageId, accessToken!),
    enabled: (options?.enabled ?? true) && !!accessToken && !!packageId,
  });
}



