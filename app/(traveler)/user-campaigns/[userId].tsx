import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, TrendingUp } from 'lucide-react-native';
import { CampaignSummaryCard } from '../../../src/components/CampaignSummaryCard';
import { colors } from '../../../src/constants/colors';
import { useCampaignDirectory } from '../../../src/hooks/use-campaigns-queries';

export default function UserCampaignsScreen() {
  const { userId, creatorName } = useLocalSearchParams<{ userId: string; creatorName?: string }>();
  const campaigns = useCampaignDirectory('', userId);

  const items = useMemo(
    () => campaigns.data?.pages.flatMap((p) => p.items) ?? [],
    [campaigns.data],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3" numberOfLines={1}>
          {creatorName ? `${creatorName}'s Campaigns` : 'Campaigns'}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (campaigns.hasNextPage && !campaigns.isFetchingNextPage) campaigns.fetchNextPage();
        }}
        ListEmptyComponent={
          campaigns.isLoading ? (
            <View className="py-16 items-center">
              <ActivityIndicator color={colors.vaykaePink} />
            </View>
          ) : campaigns.isError ? (
            <View className="py-16 items-center px-6">
              <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
                Couldn&apos;t load campaigns.
              </Text>
              <Pressable onPress={() => campaigns.refetch()}>
                <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="py-16 items-center px-6">
              <TrendingUp size={40} color={colors.mutedForeground} />
              <Text className="text-center mt-3" style={{ color: colors.mutedForeground }}>
                No public campaigns yet.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => <CampaignSummaryCard campaign={item} />}
      />
    </SafeAreaView>
  );
}
