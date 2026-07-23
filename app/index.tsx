import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth-store';

export default function Index() {
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.user?.role);

  if (status === 'authenticated') {
    return <Redirect href={role === 'agency' ? '/(agency)' : '/(traveler)'} />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
