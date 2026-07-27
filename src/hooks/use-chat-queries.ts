import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import * as chatApi from '../api/chat';
import { useAuthStore } from '../stores/auth-store';

// No websocket gateway yet (deliberately deferred — see docs/PROGRESS_TRACKER.md
// feature #3) — these use short polling intervals for near-real-time delivery
// instead. Revisit once a Socket.io gateway lands.
const CONVERSATION_LIST_POLL_MS = 6000;
const MESSAGE_POLL_MS = 4000;
const UNREAD_COUNT_POLL_MS = 10000;

export function useConversations() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatApi.listConversations(accessToken!),
    enabled: !!accessToken,
    refetchInterval: CONVERSATION_LIST_POLL_MS,
  });
}

export function useUnreadMessageCount() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['conversations', 'unread-count'],
    queryFn: () => chatApi.getUnreadCount(accessToken!),
    enabled: !!accessToken,
    refetchInterval: UNREAD_COUNT_POLL_MS,
  });
}

export function useConversation(conversationId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => chatApi.getConversation(conversationId, accessToken!),
    enabled: !!accessToken && !!conversationId,
  });
}

export function useMessages(conversationId: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam }) => chatApi.listMessages(conversationId, pageParam, accessToken!),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!accessToken && !!conversationId,
    refetchInterval: MESSAGE_POLL_MS,
  });
}
