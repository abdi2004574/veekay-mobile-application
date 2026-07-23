import { ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { screenBackgroundGradient, colors } from '../constants/colors';

interface AuthScreenLayoutProps {
  children: ReactNode;
  showBack?: boolean;
}

export function AuthScreenLayout({ children, showBack = true }: AuthScreenLayoutProps) {
  return (
    <LinearGradient colors={screenBackgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 px-6 pt-2 pb-8">
              {showBack && (
                <Pressable
                  onPress={() => router.back()}
                  className="w-10 h-10 rounded-full items-center justify-center mb-4"
                  hitSlop={8}
                >
                  <ArrowLeft size={20} color={colors.foreground} />
                </Pressable>
              )}

              <View className="flex-1 justify-center">
                <View className="items-center mb-8">
                  <Image
                    source={require('../../assets/images/logo.png')}
                    style={{ width: 141, height: 114 }}
                    resizeMode="contain"
                  />
                </View>
                {children}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
