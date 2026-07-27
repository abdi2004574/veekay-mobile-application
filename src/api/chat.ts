import { apiFetch } from './client';
import type {
  ConversationDetail,
  ConversationSummary,
  Message,
  MessageType,
  Page,
} from './types';

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}

export type CreateConversationInput =
  | { type: 'direct'; participantId: string }
  | { type: 'group'; title: string; participantIds: string[] }
  | { type: 'agency'; agencyId: string };

export function createConversation(input: CreateConversationInput, accessToken: string) {
  return apiFetch<ConversationSummary>('/conversations', {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function listConversations(accessToken: string) {
  return apiFetch<ConversationSummary[]>('/conversations', { accessToken });
}

export function getUnreadCount(accessToken: string) {
  return apiFetch<{ count: number }>('/conversations/unread-count', { accessToken });
}

export function getConversation(conversationId: string, accessToken: string) {
  return apiFetch<ConversationDetail>(`/conversations/${conversationId}`, { accessToken });
}

export function addParticipants(
  conversationId: string,
  userIds: string[],
  accessToken: string,
) {
  return apiFetch<void>(`/conversations/${conversationId}/participants`, {
    method: 'POST',
    body: { userIds },
    accessToken,
  });
}

export function removeParticipant(
  conversationId: string,
  userId: string,
  accessToken: string,
) {
  return apiFetch<void>(`/conversations/${conversationId}/participants/${userId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function markConversationRead(conversationId: string, accessToken: string) {
  return apiFetch<void>(`/conversations/${conversationId}/read`, {
    method: 'POST',
    accessToken,
  });
}

export function listMessages(
  conversationId: string,
  cursor: string | undefined,
  accessToken: string,
) {
  return apiFetch<Page<Message>>(
    withQuery(`/conversations/${conversationId}/messages`, { cursor, limit: 30 }),
    { accessToken },
  );
}

export interface SendMessageInput {
  type?: MessageType;
  body?: string;
  mediaId?: string;
  fileName?: string;
}

export function sendMessage(
  conversationId: string,
  input: SendMessageInput,
  accessToken: string,
) {
  return apiFetch<Message>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: input,
    accessToken,
  });
}
