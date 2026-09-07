import { Image, Pressable, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../constants/colors';
import type { Package } from '../api/types';

interface PackageSummaryCardProps {
  pkg: Package;
  width?: number;
  onPress?: () => void;
}

export function PackageSummaryCard({ pkg, width = 220, onPress }: PackageSummaryCardProps) {
  const heroUrl = pkg.media?.[0]?.url;
  const agencyName = pkg.agency?.agencyName ?? '';
  const reputation = pkg.agency?.reputationScore ?? null;

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl overflow-hidden bg-card"
      style={{ borderWidth: 1, borderColor: colors.border, width }}
    >
      <View style={{ position: 'relative' }}>
        {heroUrl ? (
          <Image source={{ uri: heroUrl }} style={{ width: '100%', aspectRatio: 16 / 9 }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.inputBackground }} />
        )}
      </View>

      <View className="p-3">
        <Text className="font-semibold text-sm mb-1" numberOfLines={2}>
          {pkg.title}
        </Text>
        {agencyName ? (
          <Text className="text-xs" style={{ color: colors.mutedForeground }} numberOfLines={1}>
            {agencyName}
          </Text>
        ) : null}

        <View className="flex-row items-center justify-between mt-1">
          {reputation !== null ? (
            <View className="flex-row items-center gap-1">
              <Star size={14} color={colors.starGold} />
              <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                {reputation.toFixed(1)}
              </Text>
            </View>
          ) : null}

          <Text className="text-base font-bold" style={{ color: colors.vaykaePink }}>
            ${pkg.basePrice.toLocaleString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
