import { Alert, Pressable, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

function handleComingSoon(provider: string) {
  Alert.alert(
    `${provider} sign-in`,
    'This is not functional at the moment — still in development.',
  );
}

export function SocialAuthRow() {
  return (
    <View className="mt-2">
      <View className="flex-row items-center gap-4 mb-6">
        <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
        <Text className="text-muted-foreground">or continue with</Text>
        <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
      </View>

      <View className="flex-row gap-3">
        <Pressable
          onPress={() => handleComingSoon('Google')}
          className="flex-1 h-14 rounded-2xl border flex-row items-center justify-center gap-2"
          style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
          <GoogleIcon />
          <Text className="font-medium text-foreground">Google</Text>
        </Pressable>
        <Pressable
          onPress={() => handleComingSoon('Apple')}
          className="flex-1 h-14 rounded-2xl border flex-row items-center justify-center gap-2"
          style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
        >
          <AppleIcon />
          <Text className="font-medium text-foreground">Apple</Text>
        </Pressable>
      </View>
    </View>
  );
}
