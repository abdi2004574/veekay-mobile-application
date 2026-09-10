import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '../api/users';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: usersApi.UpdateProfileInput) =>
      usersApi.updateProfile(input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: Parameters<typeof usersApi.updatePrivacySettings>[0]) =>
      usersApi.updatePrivacySettings(input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['privacy-settings'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeactivateAccount() {
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: () => usersApi.deactivateAccount(requireAccessToken()),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
