import { useMutation } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { useAuthStore } from '../stores/auth-store';

export function useRegisterTraveler() {
  return useMutation({ mutationFn: authApi.registerTraveler });
}

export function useRegisterAgency() {
  return useMutation({ mutationFn: authApi.registerAgency });
}

export function useVerifyEmail() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: setSession,
  });
}

export function useResendOtp() {
  return useMutation({ mutationFn: authApi.resendOtp });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: setSession,
  });
}

export function useAgencyLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: authApi.agencyLogin,
    onSuccess: setSession,
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: authApi.resetPassword });
}
