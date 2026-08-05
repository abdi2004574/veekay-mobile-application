import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as chatApi from '../api/chat';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: chatApi.CreateConversationInput) =>
      chatApi.createConversation(input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: chatApi.SendMessageInput) =>
      chatApi.sendMessage(conversationId, input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useMarkConversationRead(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.markConversationRead(conversationId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useAddParticipants(conversationId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userIds: string[]) =>
      chatApi.addParticipants(conversationId, userIds, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      showToast('Added to the group.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useRemoveParticipant(conversationId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userId: string) =>
      chatApi.removeParticipant(conversationId, userId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
