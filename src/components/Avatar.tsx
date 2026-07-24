import { Text, View } from 'react-native';
import { colors, vaykaeGradient } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface AvatarProps {
  name: string;
  size?: number;
}

// No Storage module exists yet, so photoMediaId has no resolvable image URL —
// initials are the honest fallback until real photo upload/serving lands.
export function Avatar({ name, size = 40 }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <LinearGradient
      colors={vaykaeGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View>
        <Text
          style={{ color: colors.background, fontSize: size * 0.4, fontWeight: '600' }}
        >
          {initial}
        </Text>
      </View>
    </LinearGradient>
  );
}
