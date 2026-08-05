import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { vaykaeGradient, colors } from '../constants/colors';

export function CampaignProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <View
      style={{ height: 10, borderRadius: 6, backgroundColor: colors.disabledBackground }}
    >
      <LinearGradient
        colors={vaykaeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${percent}%`, height: '100%', borderRadius: 6 }}
      />
    </View>
  );
}
