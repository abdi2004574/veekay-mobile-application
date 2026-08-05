import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as onboardingApi from '../api/onboarding';
import { requireAccessToken } from '../utils/require-access-token';
import { useAuthStore } from '../stores/auth-store';
import { useOnboardingWizardStore } from '../stores/onboarding-wizard-store';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useCompleteProfileSetup() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: onboardingApi.ProfileSetupInput) =>
      onboardingApi.completeProfileSetup(input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      const user = useAuthStore.getState().user;
      if (user) {
        useAuthStore.getState().updateUser({ ...user, onboardingComplete: true });
      }
      useOnboardingWizardStore.getState().reset();
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
