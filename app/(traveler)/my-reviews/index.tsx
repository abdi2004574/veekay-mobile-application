import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Edit2, Star, Trash2 } from 'lucide-react-native';
import { Avatar } from '../../../src/components/Avatar';
import { StarRating } from '../../../src/components/StarRating';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { useMyReviews } from '../../../src/hooks/use-reviews-queries';
import { useDeleteReview } from '../../../src/hooks/use-reviews-mutations';
import { showAlert } from '../../../src/utils/show-alert';

export default function MyReviewsScreen() {
  const myReviews = useMyReviews();
  const deleteReview = useDeleteReview();

  const reviews = myReviews.data ?? [];
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const confirmDelete = (reviewId: string) => {
    showAlert('Delete review?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReview.mutate(reviewId) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">My Reviews</Text>
      </View>

      {myReviews.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} />
        </View>
      ) : myReviews.isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            Couldn&apos;t load your reviews.
          </Text>
          <Pressable onPress={() => myReviews.refetch()}>
            <Text style={{ color: colors.vaykaePink }} className="font-semibold">
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={
            reviews.length > 0 ? (
              <View
                className="p-5 rounded-2xl mb-6 flex-row items-center justify-between"
                style={{ backgroundColor: colors.inputBackground }}
              >
                <View>
                  <Text className="text-sm mb-1" style={{ color: colors.mutedForeground }}>
                    Your Average Rating
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-3xl font-bold text-foreground">
                      {averageRating.toFixed(1)}
                    </Text>
                    <StarRating rating={Math.round(averageRating)} readonly size="sm" />
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-sm mb-1" style={{ color: colors.mutedForeground }}>
                    Total Reviews
                  </Text>
                  <Text className="text-3xl font-bold text-foreground">{reviews.length}</Text>
                </View>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center px-6 py-16">
              <Star size={56} color={colors.mutedForeground} />
              <Text className="text-xl font-bold text-foreground mt-4 mb-2">No Reviews Yet</Text>
              <Text className="text-center mb-6" style={{ color: colors.mutedForeground }}>
                Share your experience after a trip with an agency
              </Text>
              <GradientButton onPress={() => router.push('/(traveler)/explore')}>
                Explore Agencies
              </GradientButton>
            </View>
          }
          renderItem={({ item }) => (
            <View
              className="rounded-2xl mb-4 overflow-hidden"
              style={{ borderWidth: 1, borderColor: colors.border }}
            >
              <View
                className="p-4"
                style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <View className="flex-row items-center gap-3">
                  <Avatar name={item.agencyName} size={44} />
                  <Text className="font-bold text-foreground flex-1" numberOfLines={1}>
                    {item.agencyName}
                  </Text>
                  {item.canEdit && (
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/(traveler)/review-agency/[agencyId]',
                            params: {
                              agencyId: item.agencyId,
                              editReviewId: item.id,
                              editRating: String(item.rating),
                              editBody: item.body ?? '',
                            },
                          })
                        }
                        hitSlop={6}
                        className="items-center justify-center rounded-xl"
                        style={{ width: 36, height: 36, backgroundColor: colors.inputBackground }}
                      >
                        <Edit2 size={16} color={colors.foreground} />
                      </Pressable>
                      <Pressable
                        onPress={() => confirmDelete(item.id)}
                        hitSlop={6}
                        className="items-center justify-center rounded-xl"
                        style={{ width: 36, height: 36, backgroundColor: '#fef2f2' }}
                      >
                        <Trash2 size={16} color={colors.destructive} />
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
              <View className="p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <StarRating rating={item.rating} readonly size="sm" />
                  {item.canEdit && (
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: '#fef9c3' }}
                    >
                      <Text className="text-xs font-medium" style={{ color: '#a16207' }}>
                        Editable
                      </Text>
                    </View>
                  )}
                </View>
                {!!item.body && (
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    {item.body}
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
