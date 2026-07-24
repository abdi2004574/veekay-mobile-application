import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as feedApi from '../api/feed';
import { useAuthStore } from '../stores/auth-store';

export function useFeed() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => feedApi.getFeed(pageParam, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken,
  });
}

export function useUserPosts(userId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ['user-posts', userId],
    queryFn: ({ pageParam }) => feedApi.getUserPosts(userId, pageParam, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken && !!userId,
  });
}

export function useComments(postId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => feedApi.listComments(postId, pageParam, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken && !!postId,
  });
}

export function useActiveStories() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['stories'],
    queryFn: () => feedApi.listActiveStories(accessToken!),
    enabled: !!accessToken,
  });
}
