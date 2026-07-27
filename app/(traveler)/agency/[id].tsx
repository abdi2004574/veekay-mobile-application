import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MessageCircle, ShieldCheck, Star } from 'lucide-react-native';
import { Avatar } from '../../../src/components/Avatar';
import { StarRating } from '../../../src/components/StarRating';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { useAgency } from '../../../src/hooks/use-agencies-queries';
import { useAgencyReviews, useMyReviews } from '../../../src/hooks/use-reviews-queries';
import { useCreateConversation } from '../../../src/hooks/use-chat-mutations';
import { useAuthStore } from '../../../src/stores/auth-store';
import { showInDevelopmentAlert } from '../../../src/utils/in-development';
import { formatTimeAgo } from '../../../src/utils/format-time-ago';

export default function AgencyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id) ?? '';

  const agency = useAgency(id);
  const reviews = useAgencyReviews(id);
  const myReviews = useMyReviews();
  const createConversation = useCreateConversation();

  const items = useMemo(() => reviews.data?.pages.flatMap((p) => p.items) ?? [], [reviews.data]);
  const myReviewForThisAgency = myReviews.data?.find((r) => r.agencyId === id);

  if (agency.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.vaykaePink} />
      </SafeAreaView>
    );
  }

  if (agency.isError || !agency.data) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
          Couldn&apos;t load this agency.
        </Text>
        <Pressable onPress={() => agency.refetch()}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const info = agency.data;

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
          {info.agencyName}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (reviews.hasNextPage && !reviews.isFetchingNextPage) reviews.fetchNextPage();
        }}
        ListHeaderComponent={
          <View className="mb-6">
            <View className="flex-row items-start gap-3 mb-4">
              <Avatar name={info.agencyName} size={64} />
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-xl font-bold text-foreground" numberOfLines={1}>
                    {info.agencyName}
                  </Text>
                  <View
                    className="flex-row items-center gap-1 px-2 py-0.5 rounded"
                    style={{ backgroundColor: colors.inputBackground }}
                  >
                    <ShieldCheck size={12} color={colors.vaykaePink} />
                    <Text className="text-xs font-medium" style={{ color: colors.vaykaePink }}>
                      Verified
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  {info.reputationScore !== null ? (
                    <View className="flex-row items-center gap-1">
                      <Star size={14} color={colors.starGold} fill={colors.starGold} />
                      <Text className="text-sm font-medium text-foreground">
                        {info.reputationScore.toFixed(1)}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                      No ratings yet
                    </Text>
                  )}
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    • {info.reviewCount} review{info.reviewCount === 1 ? '' : 's'}
                  </Text>
                </View>
              </View>
            </View>

            {!!info.description && (
              <Text className="text-sm mb-4" style={{ color: colors.foreground }}>
                {info.description}
              </Text>
            )}

            <View className="gap-3 mb-6">
              <Pressable
                onPress={() =>
                  createConversation.mutate(
                    { type: 'agency', agencyId: info.id },
                    {
                      onSuccess: (conversation) =>
                        router.push(`/(traveler)/chat/${conversation.id}`),
                    },
                  )
                }
                disabled={createConversation.isPending}
                className="h-12 rounded-2xl items-center justify-center flex-row gap-2"
                style={{ borderWidth: 2, borderColor: colors.vaykaePink }}
              >
                {createConversation.isPending ? (
                  <ActivityIndicator color={colors.vaykaePink} />
                ) : (
                  <>
                    <MessageCircle size={18} color={colors.vaykaePink} />
                    <Text className="font-semibold" style={{ color: colors.vaykaePink }}>
                      Contact Agency
                    </Text>
                  </>
                )}
              </Pressable>
              <Pressable
                onPress={() =>
                  showInDevelopmentAlert('Linking a fundraiser isn’t available yet.')
                }
                className="h-12 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.inputBackground }}
              >
                <Text className="font-semibold" style={{ color: colors.mutedForeground }}>
                  Link to My Fundraiser
                </Text>
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-foreground">Reviews ({info.reviewCount})</Text>
            </View>

            {!myReviewForThisAgency && (
              <View
                className="p-4 rounded-2xl mb-4"
                style={{ backgroundColor: colors.inputBackground }}
              >
                <View className="flex-row items-center gap-2 mb-2">
                  <Star size={18} color={colors.vaykaePink} />
                  <Text className="font-bold text-foreground">Share Your Experience</Text>
                </View>
                <Text className="text-sm mb-3" style={{ color: colors.mutedForeground }}>
                  Help other travelers by rating this agency.
                </Text>
                <GradientButton onPress={() => router.push(`/(traveler)/review-agency/${info.id}`)}>
                  Write a Review
                </GradientButton>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          reviews.isLoading ? (
            <ActivityIndicator color={colors.vaykaePink} />
          ) : (
            <View className="items-center px-6 py-8">
              <Text style={{ color: colors.mutedForeground }}>No reviews yet.</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const reviewerName = item.reviewer.displayName ?? `@${item.reviewer.username}`;
          const isMine = item.reviewer.id === currentUserId;
          return (
            <View
              className="p-4 rounded-2xl mb-3"
              style={{ backgroundColor: colors.inputBackground }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <Avatar name={reviewerName} size={24} />
                  <Text className="font-medium text-foreground">
                    {isMine ? 'You' : reviewerName}
                  </Text>
                </View>
                <StarRating rating={item.rating} readonly size="sm" />
              </View>
              {!!item.body && (
                <Text className="text-sm mb-2" style={{ color: colors.mutedForeground }}>
                  {item.body}
                </Text>
              )}
              <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                {formatTimeAgo(item.createdAt)}
              </Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
