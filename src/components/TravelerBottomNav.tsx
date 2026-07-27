import { router } from 'expo-router';
import { Compass, Heart, Home, MessageCircle, User } from 'lucide-react-native';
import { BottomNavBar } from './BottomNavBar';
import { showInDevelopmentAlert } from '../utils/in-development';

export type TravelerTab = 'home' | 'explore' | 'campaigns' | 'chat' | 'profile';

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
          onPress: () => showInDevelopmentAlert('Campaigns aren’t built yet.'),
        },
        {
          key: 'chat',
          icon: MessageCircle,
          label: 'Chat',
          // replace, not push — these are tabs, not a stack; push kept
          // re-animating in and piling up duplicate screens on the back stack.
          onPress: () => router.replace('/(traveler)/chat'),
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
