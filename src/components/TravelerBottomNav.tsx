import { router } from 'expo-router';
import { Bell, Compass, Heart, Home, MessageCircle, User, Wallet } from 'lucide-react-native';
import { BottomNavBar } from './BottomNavBar';

export type TravelerTab = 'home' | 'explore' | 'campaigns' | 'chat' | 'notifications' | 'wallet' | 'profile';

export function TravelerBottomNav({ active }: { active: TravelerTab }) {
  return (
    <BottomNavBar
      active={active}
      items={[
        { key: 'home', icon: Home, label: 'Home', onPress: () => router.replace('/(traveler)') },
        {
          key: 'explore',
          icon: Compass,
          label: 'Explore',
          onPress: () => router.replace('/(traveler)/explore'),
        },
        {
          key: 'campaigns',
          icon: Heart,
          label: 'Campaigns',
          onPress: () => router.replace('/(traveler)/campaigns'),
        },
        {
          key: 'chat',
          icon: MessageCircle,
          label: 'Chat',
          onPress: () => router.replace('/(traveler)/chat'),
        },
        {
          key: 'notifications',
          icon: Bell,
          label: 'Alerts',
          onPress: () => router.replace('/(traveler)/notifications'),
        },
        {
          key: 'wallet',
          icon: Wallet,
          label: 'Wallet',
          onPress: () => router.replace('/(traveler)/wallet'),
        },
        {
          key: 'profile',
          icon: User,
          label: 'Profile',
          onPress: () => router.replace('/(traveler)/profile'),
        },
      ]}
    />
  );
}
