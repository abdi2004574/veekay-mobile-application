import { router } from 'expo-router';
import { resendOtp } from '../api/auth';
import type { AuthUser } from '../api/types';

// A traveler/agency account can log in before verifying its email (the
// backend allows it on purpose — see docs/features/01-auth-and-onboarding.md's
// "Unverified travelers can log in but are restricted..."). The mobile client
// still needs to route them back to finish verification instead of letting
// them straight into the app, so it re-sends a fresh code and redirects.
export function navigateAfterLogin(user: AuthUser) {
  if (!user.isEmailVerified) {
    resendOtp({ email: user.email, type: 'email_verify' }).catch(() => {});
    router.replace({
      pathname: '/(auth)/verify-otp',
      params: { userId: user.id, email: user.email, role: user.role },
    });
    return;
  }

  router.replace('/');
}
