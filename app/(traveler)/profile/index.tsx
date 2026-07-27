import { ProfileScreen } from '../../../src/components/ProfileScreen';
import { useAuthStore } from '../../../src/stores/auth-store';

// The bottom-nav "Profile" tab — always your own profile. Kept as its own
// route (distinct from user/[id]) so its animation can be set to 'none' in
// the layout, matching the other tabs, without affecting the drill-down
// route used when viewing someone else's profile.
export default function MyProfileRoute() {
  const currentUserId = useAuthStore((s) => s.user?.id) ?? '';
  return <ProfileScreen userId={currentUserId} showBackButton={false} />;
}
