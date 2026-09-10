import { useMutation } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { useAuthStore } from '../stores/auth-store';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';
import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';
import { useNotificationStore } from '../stores/notification-store';
import { registerFcmToken } from '../services/firebase-messaging';

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

export function useChangePassword() {
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(input, requireAccessToken()),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useLogoutAll() {
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: () => authApi.logoutAll(requireAccessToken()),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export async function requestNotificationsPermission() {
  const authStatus = await messaging().requestPermission();
  const granted =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  const setPermissionStatus = useNotificationStore.getState().setPermissionStatus;
  setPermissionStatus(granted ? 'authorized' : 'denied');

  if (granted) {
    await registerFcmToken();
  }

  return granted;
}

