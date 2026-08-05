import { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, vaykaeGradient } from '../constants/colors';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <LinearGradient colors={vaykaeGradient} style={{ padding: 24, paddingBottom: 32 }}>
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          hitSlop={8}
        >
          <ArrowLeft size={20} color="#fff" />
        </Pressable>
        <Text className="text-2xl font-bold text-white mb-1">{title}</Text>
        <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Last updated: {lastUpdated}
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40, gap: 24 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <View>
      <Text className="text-base font-bold text-foreground mb-2">{heading}</Text>
      {children}
    </View>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-2" style={{ color: colors.mutedForeground, lineHeight: 22 }}>
      {children}
    </Text>
  );
}

export function LegalBullet({ children }: { children: ReactNode }) {
  return (
    <Text className="mb-1 ml-2" style={{ color: colors.mutedForeground, lineHeight: 22 }}>
      • {children}
    </Text>
  );
}

export function LegalContactCard({ lines }: { lines: string[] }) {
  return (
    <View className="mt-2 p-4 rounded-2xl" style={{ backgroundColor: colors.inputBackground }}>
      {lines.map((line) => (
        <Text key={line} className="text-sm text-foreground">
          {line}
        </Text>
      ))}
    </View>
  );
}
