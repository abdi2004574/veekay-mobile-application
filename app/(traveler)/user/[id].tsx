import { useLocalSearchParams } from 'expo-router';
import { ProfileScreen } from '../../../src/components/ProfileScreen';

export default function UserProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProfileScreen userId={id} />;
}
