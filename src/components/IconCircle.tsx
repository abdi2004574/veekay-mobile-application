import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import { vaykaeGradient } from '../constants/colors';

interface IconCircleProps {
  icon: LucideIcon;
  size?: number;
}

export function IconCircle({ icon: Icon, size = 64 }: IconCircleProps) {
  return (
    <LinearGradient
      colors={vaykaeGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={size * 0.5} color="#ffffff" />
      </View>
    </LinearGradient>
  );
}
