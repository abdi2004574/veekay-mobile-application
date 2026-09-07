import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as packagesApi from '../api/packages';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useCreatePackage() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: packagesApi.PackageInput) =>
      packagesApi.createPackage(input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packages', 'mine'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({
      packageId,
      input,
    }: {
      packageId: string;
      input: Partial<packagesApi.PackageInput>;
    }) => packagesApi.updatePackage(packageId, input, requireAccessToken()),
    onSuccess: (_data, { packageId }) => {
      queryClient.invalidateQueries({ queryKey: ['packages', 'mine'] });
      queryClient.invalidateQueries({ queryKey: ['package', packageId] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (packageId: string) =>
      packagesApi.deletePackage(packageId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages', 'mine'] });
      showToast('Package deleted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
