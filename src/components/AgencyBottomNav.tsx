import { router } from 'expo-router';
import { Inbox, LayoutDashboard, MessageCircle, Package, User } from 'lucide-react-native';
import { BottomNavBar } from './BottomNavBar';
import { showInDevelopmentAlert } from '../utils/in-development';

export type AgencyTab = 'home' | 'packages' | 'requests' | 'chat' | 'profile';

export function AgencyBottomNav({ active }: { active: AgencyTab }) {
  return (
    <BottomNavBar
      active={active}
      items={[
        {
          key: 'home',
          icon: LayoutDashboard,
          label: 'Home',
          onPress: () => router.replace('/(agency)'),
        },
        {
          key: 'packages',
          icon: Package,
          label: 'Packages',
          onPress: () => router.replace('/(agency)/packages'),
        },
        {
          key: 'requests',
          icon: Inbox,
          label: 'Requests',
          onPress: () => router.replace('/(agency)/requests'),
        },
        {
          key: 'chat',
          icon: MessageCircle,
          label: 'Chat',
          onPress: () => router.replace('/(agency)/inbox'),
        },
        {
          key: 'profile',
          icon: User,
          label: 'Profile',
          onPress: () => showInDevelopmentAlert('Agency profile isn'\''t built yet.'),
        },
      ]}
    />
  );
}
