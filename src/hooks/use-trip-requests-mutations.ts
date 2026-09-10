import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TripRequestStatus } from '../api/types';
import * as tripRequestsApi from '../api/trip-requests';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useUpdateTripRequestStatus() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TripRequestStatus }) =>
      tripRequestsApi.updateTripRequestStatus(id, status, requireAccessToken()),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['trip-request', id] });
      queryClient.invalidateQueries({ queryKey: ['trip-requests', 'agency'] });
      queryClient.invalidateQueries({ queryKey: ['trip-requests', 'mine'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useCancelTripRequest() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (id: string) => tripRequestsApi.cancelTripRequest(id, requireAccessToken()),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['trip-requests', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['trip-request', id] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useCreateTripRequest() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: tripRequestsApi.CreateTripRequestInput) =>
      tripRequestsApi.createTripRequest(input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-requests', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useCreateSmartReplyTemplate() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: tripRequestsApi.SmartReplyTemplateInput) =>
      tripRequestsApi.createSmartReplyTemplate(input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smart-reply-templates'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateSmartReplyTemplate() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: tripRequestsApi.SmartReplyTemplateInput }) =>
      tripRequestsApi.updateSmartReplyTemplate(id, input, requireAccessToken()),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['smart-reply-templates'] });
      queryClient.invalidateQueries({ queryKey: ['smart-reply-templates', id] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeleteSmartReplyTemplate() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (id: string) =>
      tripRequestsApi.deleteSmartReplyTemplate(id, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['smart-reply-templates'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

