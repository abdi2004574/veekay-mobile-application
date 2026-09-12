import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as packagesApi from '../api/packages';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useLinkPackageToCampaign() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ packageId, campaignId }: { packageId: string; campaignId: string }) =>
      packagesApi.linkPackageToCampaign(packageId, campaignId, requireAccessToken()),
    onSuccess: (_data, { packageId }) => {
      queryClient.invalidateQueries({ queryKey: ['package', packageId] });
      queryClient.invalidateQueries({ queryKey: ['packages', 'public'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'mine'] });
      showToast('Package linked to your campaign.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnlinkPackageFromCampaign() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ packageId, campaignId }: { packageId: string; campaignId: string }) =>
      packagesApi.unlinkPackageFromCampaign(packageId, campaignId, requireAccessToken()),
    onSuccess: (_data, { packageId }) => {
      queryClient.invalidateQueries({ queryKey: ['package', packageId] });
      queryClient.invalidateQueries({ queryKey: ['packages', 'public'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'mine'] });
      showToast('Package unlinked.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
