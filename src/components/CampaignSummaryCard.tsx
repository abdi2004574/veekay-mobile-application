import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Gift } from 'lucide-react-native';
import { CampaignProgressBar } from './CampaignProgressBar';
import { colors } from '../constants/colors';
import type { Campaign } from '../api/types';

// Read-only — no edit/delete affordances, unlike the My Campaigns list card.
// Used by Explore's browse carousel and by "view this traveler's campaigns".
export function CampaignSummaryCard({ campaign, width }: { campaign: Campaign; width?: number }) {
  const heroUrl = campaign.photos[0]?.url;

  return (
    <Pressable
      onPress={() => router.push(`/(traveler)/campaigns/${campaign.id}`)}
      className="rounded-2xl overflow-hidden bg-card"
      style={{ borderWidth: 1, borderColor: colors.border, width }}
    >
      <View style={{ position: 'relative' }}>
        {heroUrl ? (
          <Image source={{ uri: heroUrl }} style={{ width: '100%', aspectRatio: 16 / 9 }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.inputBackground }} />
        )}
        {campaign.giftMode && (
          <View style={{ position: 'absolute', top: 8, left: 8 }}>
            <View className="px-2 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: colors.vaykaePink }}>
              <Gift size={11} color={colors.background} />
              <Text className="text-xs font-bold" style={{ color: colors.background }}>
                Gift
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className="p-3">
        <Text className="font-bold text-foreground mb-0.5" numberOfLines={1}>
          {campaign.title}
        </Text>
        <Text className="text-xs mb-2" style={{ color: colors.mutedForeground }} numberOfLines={1}>
          {campaign.destination}
        </Text>
        <CampaignProgressBar raised={0} goal={campaign.goalAmount} />
        <Text className="text-xs mt-1.5" style={{ color: colors.mutedForeground }}>
          $0 of ${campaign.goalAmount.toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}
