import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { agencyBackgroundGradient, colors } from '../constants/colors';

interface AgencyAuthLayoutProps {
  children: ReactNode;
  header: ReactNode;
  showBack?: boolean;
}

export function AgencyAuthLayout({ children, header, showBack = true }: AgencyAuthLayoutProps) {
  return (
    <LinearGradient colors={agencyBackgroundGradient} style={{ flex: 1 }}>
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
              <View className="flex-row items-center mb-6 pt-2" style={{ height: 40 }}>
                {showBack && (
                  <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    hitSlop={8}
                  >
                    <ArrowLeft size={22} color={colors.foreground} />
                  </Pressable>
                )}
              </View>

              <View className="items-center mb-8">{header}</View>

              <View className="flex-1">{children}</View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
