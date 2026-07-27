import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as chatApi from '../api/chat';
import { useAuthStore } from '../stores/auth-store';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

function useToken() {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) throw new Error('Not authenticated');
  return accessToken;
}

export function useCreateConversation() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: chatApi.CreateConversationInput) =>
      chatApi.createConversation(input, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useSendMessage(conversationId: string) {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: chatApi.SendMessageInput) =>
      chatApi.sendMessage(conversationId, input, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useMarkConversationRead(conversationId: string) {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.markConversationRead(conversationId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useAddParticipants(conversationId: string) {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userIds: string[]) =>
      chatApi.addParticipants(conversationId, userIds, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      showToast('Added to the group.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useRemoveParticipant(conversationId: string) {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userId: string) =>
      chatApi.removeParticipant(conversationId, userId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
