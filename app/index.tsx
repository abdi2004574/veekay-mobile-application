import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth-store';

export default function Index() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);

  if (status === 'authenticated') {
    if (user?.role === 'traveler' && !user.onboardingComplete) {
      return <Redirect href="/(onboarding)/create-profile" />;
    }
    return <Redirect href={user?.role === 'agency' ? '/(agency)' : '/(traveler)'} />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
