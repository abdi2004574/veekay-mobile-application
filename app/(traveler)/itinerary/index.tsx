import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import { colors } from '../../../src/constants/colors';

// Every field figma's "Browse Packages" screen shows (price, duration,
// rating, "trips you can afford") comes from the Package entity (#9) and
// campaign funding progress (#5/#6) — neither exists yet, so there's nothing
// real to back a package grid with. Honest coming-soon state instead of a
// fake list, per the standing "don't build fake interactions" rule.
export default function ItineraryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">Browse Packages</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Package size={48} color={colors.mutedForeground} />
        <Text className="text-lg font-bold text-foreground mt-4 mb-2 text-center">
          Packages are coming soon
        </Text>
        <Text className="text-center" style={{ color: colors.mutedForeground }}>
          Agencies will be able to publish bookable trip packages here once that feature
          launches.
        </Text>
      </View>
    </SafeAreaView>
  );
}
