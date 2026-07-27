import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { StarRating } from '../../../src/components/StarRating';
import { GradientButton } from '../../../src/components/GradientButton';
import { Avatar } from '../../../src/components/Avatar';
import { colors } from '../../../src/constants/colors';
import { useAgency } from '../../../src/hooks/use-agencies-queries';
import { useCreateReview, useUpdateReview } from '../../../src/hooks/use-reviews-mutations';

const BODY_LIMIT = 500;
const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function ReviewAgencyScreen() {
  const { agencyId, editReviewId, editRating, editBody } = useLocalSearchParams<{
    agencyId: string;
    editReviewId?: string;
    editRating?: string;
    editBody?: string;
  }>();
  const isEditing = !!editReviewId;

  const agency = useAgency(agencyId);
  const createReview = useCreateReview(agencyId);
  const updateReview = useUpdateReview(agencyId);
  const isPending = createReview.isPending || updateReview.isPending;

  const [rating, setRating] = useState(editRating ? Number(editRating) : 0);
  const [body, setBody] = useState(editBody ?? '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    const input = { rating, body: body.trim() || undefined };

    if (isEditing) {
      updateReview.mutate(
        { reviewId: editReviewId, input },
        { onSuccess: () => router.back() },
      );
      return;
    }

    createReview.mutate(input, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => router.replace('/(traveler)/my-reviews'), 1500);
      },
    });
  };

  if (showSuccess) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-8">
        <View
          className="items-center justify-center rounded-full mb-6"
          style={{ width: 96, height: 96, backgroundColor: colors.vaykaePink }}
        >
          <CheckCircle2 size={56} color={colors.background} />
        </View>
        <Text className="text-2xl font-bold text-foreground mb-2">Review Submitted!</Text>
        <Text className="text-center" style={{ color: colors.mutedForeground }}>
          Thank you for sharing your experience. Your feedback helps other travelers make
          informed decisions.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">
          {isEditing ? 'Edit Review' : 'Rate Your Experience'}
        </Text>
      </View>

      <View className="p-6">
        {agency.data && (
          <View
            className="flex-row items-center gap-3 p-4 rounded-2xl mb-6"
            style={{ backgroundColor: colors.inputBackground }}
          >
            <Avatar name={agency.data.agencyName} size={56} />
            <Text className="font-bold text-lg text-foreground flex-1" numberOfLines={1}>
              {agency.data.agencyName}
            </Text>
          </View>
        )}

        <Text className="font-bold text-foreground mb-3 text-center">
          How would you rate your experience?
        </Text>
        <View
          className="items-center py-6 rounded-2xl mb-6"
          style={{ borderWidth: 1, borderColor: colors.border }}
        >
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          {rating > 0 && (
            <Text className="mt-3 text-lg font-bold" style={{ color: colors.vaykaePink }}>
              {RATING_LABELS[rating]}
            </Text>
          )}
        </View>

        <Text className="font-bold text-foreground mb-3">Share your experience (Optional)</Text>
        <TextInput
          value={body}
          onChangeText={(v) => setBody(v.slice(0, BODY_LIMIT))}
          placeholder="Tell others about your trip, the service quality, communication, and overall experience..."
          placeholderTextColor={colors.mutedForeground}
          multiline
          numberOfLines={5}
          className="rounded-2xl px-4 py-3 text-foreground mb-1"
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.inputBackground,
            minHeight: 120,
            textAlignVertical: 'top',
          }}
        />
        <Text className="text-xs mb-6 text-right" style={{ color: colors.mutedForeground }}>
          {body.length}/{BODY_LIMIT}
        </Text>

        <GradientButton onPress={handleSubmit} disabled={rating === 0} loading={isPending}>
          {isEditing ? 'Save Changes' : 'Submit Review'}
        </GradientButton>
        <Text className="text-xs text-center mt-3" style={{ color: colors.mutedForeground }}>
          You can edit or delete this review within 7 days
        </Text>
      </View>
    </SafeAreaView>
  );
}
