import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as campaignsApi from '../api/campaigns';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: campaignsApi.CampaignInput) =>
      campaignsApi.createCampaign(input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns', 'mine'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({
      campaignId,
      input,
    }: {
      campaignId: string;
      input: Partial<campaignsApi.CampaignInput>;
    }) => campaignsApi.updateCampaign(campaignId, input, requireAccessToken()),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (campaignId: string) => campaignsApi.deleteCampaign(campaignId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'mine'] });
      showToast('Campaign deleted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
