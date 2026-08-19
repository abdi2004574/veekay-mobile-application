import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as groupCampaignsApi from '../api/group-campaigns';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useAddGroupMember(campaignId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userId: string) =>
      groupCampaignsApi.addGroupMember(campaignId, userId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['group-trips', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useRemoveGroupMember(campaignId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (userId: string) =>
      groupCampaignsApi.removeGroupMember(campaignId, userId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['group-trips', 'mine'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useAddGroupContribution(campaignId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: { amount: number; note?: string }) =>
      groupCampaignsApi.addGroupContribution(campaignId, input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['group-trips', 'mine'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useAddGroupExpense(campaignId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: groupCampaignsApi.AddGroupExpenseInput) =>
      groupCampaignsApi.addGroupExpense(campaignId, input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-campaign', campaignId] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useRemoveGroupExpense(campaignId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (expenseId: string) =>
      groupCampaignsApi.removeGroupExpense(campaignId, expenseId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-campaign', campaignId] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
