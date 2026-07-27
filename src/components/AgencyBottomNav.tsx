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
          onPress: () => showInDevelopmentAlert('Packages aren’t built yet.'),
        },
        {
          key: 'requests',
          icon: Inbox,
          label: 'Requests',
          onPress: () => showInDevelopmentAlert('Requests aren’t built yet.'),
        },
        {
          key: 'chat',
          icon: MessageCircle,
          label: 'Chat',
          // Own directory name (not "chat") so its URL doesn't collide with
          // (traveler)/chat — group segments are invisible in the URL, so
          // two groups both named "chat" would both resolve to the bare
          // `/chat` path and refreshing that page could land on either.
          // replace, not push — these are tabs, not a stack.
          onPress: () => router.replace('/(agency)/inbox'),
        },
        {
          key: 'profile',
          icon: User,
          label: 'Profile',
          onPress: () => showInDevelopmentAlert('Agency profile isn’t built yet.'),
        },
      ]}
    />
  );
}
