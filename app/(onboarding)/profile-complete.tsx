import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CheckCircle2, Gift, MapPin, Share2, Users } from 'lucide-react-native';
import { GradientButton } from '../../src/components/GradientButton';
import { colors, screenBackgroundGradient } from '../../src/constants/colors';

const CHECKLIST = [
  { icon: MapPin, label: 'Create fundraising campaigns for your trips' },
  { icon: Users, label: 'Discover and connect with travel agencies' },
  { icon: Gift, label: 'Receive donations and gifts from friends & family' },
  { icon: Share2, label: 'Share your journey with the community' },
];

export default function ProfileCompleteScreen() {
  return (
    <LinearGradient colors={screenBackgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center px-6">
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.vaykaePink,
              marginBottom: 24,
            }}
          >
            <CheckCircle2 size={48} color={colors.background} />
          </View>

          <Text className="text-2xl font-bold text-foreground mb-2 text-center">
            Profile Complete!
          </Text>
          <Text className="text-center mb-8" style={{ color: colors.mutedForeground }}>
            Your Vaykae account is ready. Start your journey today!
          </Text>

          <View
            className="w-full p-5 rounded-2xl mb-8"
            style={{ backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border }}
          >
            {CHECKLIST.map(({ icon: Icon, label }, i) => (
              <View
                key={label}
                className="flex-row items-center gap-3"
                style={i < CHECKLIST.length - 1 ? { marginBottom: 14 } : undefined}
              >
                <Icon size={18} color={colors.vaykaePink} />
                <Text className="flex-1 text-sm text-foreground">{label}</Text>
              </View>
            ))}
          </View>

          <View className="w-full">
            <GradientButton onPress={() => router.replace('/')}>Get Started</GradientButton>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
