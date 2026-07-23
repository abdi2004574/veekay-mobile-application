import { Image, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, Building2, User } from 'lucide-react-native';
import { colors, screenBackgroundGradient, vaykaeGradient } from '../../src/constants/colors';

const userTypes = [
  {
    id: 'traveler' as const,
    title: 'Traveler',
    description: 'Raise funds for your dream vacation and share your journey',
    icon: User,
  },
  {
    id: 'agency' as const,
    title: 'Travel Agency',
    description: 'Connect with travelers and offer exclusive packages',
    icon: Building2,
  },
];

export default function Welcome() {
  return (
    <LinearGradient colors={screenBackgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 px-6">
          <View className="items-center pt-16 mb-8">
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 141, height: 114 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-1 justify-center">
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-foreground mb-2">
                Welcome to Vaykae
              </Text>
              <Text className="text-muted-foreground">
                Choose how you want to continue
              </Text>
            </View>

            <View className="gap-4">
              {userTypes.map((type) => (
                <Pressable
                  key={type.id}
                  onPress={() => router.push(`/(auth)/login?role=${type.id}`)}
                  className="rounded-3xl bg-card border-2 p-6"
                  style={{ borderColor: colors.border, minHeight: 150 }}
                >
                  <View className="flex-row items-start gap-4">
                    <LinearGradient
                      colors={vaykaeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <type.icon size={28} color="#ffffff" />
                    </LinearGradient>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-foreground mb-1">
                        {type.title}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {type.description}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-end mt-4">
                    <ArrowRight size={20} color={colors.mutedForeground} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <Text className="text-center text-sm text-muted-foreground px-6 pb-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
