import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Gift,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { Avatar } from '../../../src/components/Avatar';
import { CampaignProgressBar } from '../../../src/components/CampaignProgressBar';
import { DonateSheet } from '../../../src/components/DonateSheet';
import { colors } from '../../../src/constants/colors';
import { useCampaign, useTopContributors } from '../../../src/hooks/use-campaigns-queries';
import { useCreateConversation } from '../../../src/hooks/use-chat-mutations';
import { showInDevelopmentAlert } from '../../../src/utils/in-development';
import { useState } from 'react';

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaign = useCampaign(id);
  const topContributors = useTopContributors(id);
  const createConversation = useCreateConversation();
  const [donateSheetVisible, setDonateSheetVisible] = useState(false);

  if (campaign.isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-background items-center justify-center'>
        <ActivityIndicator color={colors.vaykaePink} />
      </SafeAreaView>
    );
  }

  if (campaign.isError || !campaign.data) {
    return (
      <SafeAreaView className='flex-1 bg-background items-center justify-center px-6'>
        <Text className='text-center mb-3' style={{ color: colors.mutedForeground }}>
          Couldnt load this campaign.
        </Text>
        <Pressable onPress={() => campaign.refetch()}>
          <Text style={{ color: colors.vaykaePink }} className='font-semibold'>
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const c = campaign.data;
  const heroUrl = c.photos[0]?.url;
  const creatorName = c.creator.displayName ?? '@' + c.creator.username;
  const contributors = topContributors.data?.items ?? [];

  const handleDonatePress = () => {
    setDonateSheetVisible(true);
  };

  const handleDonateClose = () => {
    setDonateSheetVisible(false);
    campaign.refetch();
  };

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ position: 'relative' }}>
          {heroUrl ? (
            <Image source={{ uri: heroUrl }} style={{ width: '100%', aspectRatio: 4 / 3 }} resizeMode='cover' />
          ) : (
            <View style={{ width: '100%', aspectRatio: 4 / 3, backgroundColor: colors.inputBackground }} />
          )}
          <Pressable
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <ArrowLeft size={20} color='#fff' />
          </Pressable>
          <Pressable
            onPress={() => showInDevelopmentAlert('Sharing a campaign link isnt available yet.')}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <Share2 size={20} color='#fff' />
          </Pressable>
          {c.giftMode && (
            <View style={{ position: 'absolute', bottom: 16, left: 16 }}>
              <View className='px-3 py-1.5 rounded-full flex-row items-center gap-1.5' style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <Gift size={14} color={colors.vaykaePink} />
                <Text className='text-xs font-bold text-foreground'>Gift Mode Active</Text>
              </View>
            </View>
          )}
        </View>

        <View className='px-4 py-4'>
          <Pressable
            onPress={c.isCreator ? undefined : () => router.push('/(traveler)/user/' + c.creator.id)}
            className='flex-row items-center gap-3 mb-4'
          >
            <Avatar name={creatorName} size={48} />
            <View style={{ flex: 1 }}>
              <Text className='font-bold text-foreground'>{creatorName}</Text>
              <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                {c.destination}
              </Text>
            </View>
          </Pressable>

          <View className='mb-4'>
            <Text className='text-2xl font-bold text-foreground mb-2'>{c.title}</Text>
            <View className='flex-row items-center gap-4'>
              <View className='flex-row items-center gap-1'>
                <Calendar size={14} color={colors.mutedForeground} />
                <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                  {new Date(c.tripStartDate).toLocaleDateString()}
                </Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <Eye size={14} color={colors.mutedForeground} />
                <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                  {c.viewsCount} views
                </Text>
              </View>
            </View>
          </View>

          {!!c.story && (
            <Text className='mb-6' style={{ color: colors.mutedForeground, lineHeight: 22 }}>
              {c.story}
            </Text>
          )}

          <View
            className='p-5 rounded-2xl mb-6'
            style={{ backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border }}
          >
            <View className='flex-row justify-between items-center mb-4'>
              <View>
                <Text className='text-3xl font-bold text-foreground'>{c.raisedAmount ?? 0}</Text>
                <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                  raised of ${c.goalAmount.toLocaleString()} goal
                </Text>
              </View>
              <View className='items-end'>
                <Text className='text-2xl font-bold text-foreground'>{c.contributorsCount}</Text>
                <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                  donors
                </Text>
              </View>
            </View>
            <CampaignProgressBar raised={c.raisedAmount ?? 0} goal={c.goalAmount} />
            <View
              className='flex-row items-center justify-between mt-3 pt-3'
              style={{ borderTopWidth: 1, borderTopColor: colors.border }}
            >
              <View className='flex-row items-center gap-1'>
                <TrendingUp size={14} color={colors.mutedForeground} />
                <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                  {c.goalAmount > 0 ? Math.round(((c.raisedAmount ?? 0) / c.goalAmount) * 100) : 0}% funded
                </Text>
              </View>
              <Text className='text-sm font-bold' style={{ color: colors.vaykaePink }}>
                {Math.max(0, c.goalAmount - (c.raisedAmount ?? 0)).toLocaleString()} to go
              </Text>
            </View>
          </View>

          <View className='mb-6'>
            <View className='flex-row items-center gap-2 mb-3'>
              <Users size={18} color={colors.vaykaePink} />
              <Text className='font-bold text-foreground'>Top Contributors</Text>
            </View>
            {contributors.length === 0 ? (
              <View className='items-center py-6 rounded-xl' style={{ backgroundColor: colors.inputBackground }}>
                <Text className='text-sm' style={{ color: colors.mutedForeground }}>
                  No contributors yet
                </Text>
              </View>
            ) : null}
          </View>

          {c.isCreator ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(traveler)/campaigns/create',
                  params: {
                    editCampaignId: c.id,
                    editTitle: c.title,
                    editDestination: c.destination,
                    editGoalAmount: String(c.goalAmount),
                    editTripStartDate: c.tripStartDate.slice(0, 10),
                    editTripEndDate: c.tripEndDate ? c.tripEndDate.slice(0, 10) : '',
                    editStory: c.story ?? '',
                    editPrivacy: c.privacy,
                    editGiftMode: c.giftMode ? '1' : '0',
                    editGiftOccasion: c.giftOccasion ?? '',
                    editPhotoMediaIds: c.photos.map((p) => p.mediaId).join(','),
                    editPhotoUrls: c.photos.map((p) => p.url ?? '').join(','),
                    editItineraryMediaId: c.itineraryMediaId ?? '',
                    editAgencyQuoteMediaId: c.agencyQuoteMediaId ?? '',
                  },
                })
              }
              className='h-14 rounded-2xl items-center justify-center'
              style={{ backgroundColor: colors.vaykaePink }}
            >
              <Text className='font-bold' style={{ color: colors.background }}>
                Edit Campaign
              </Text>
            </Pressable>
          ) : (
            <View className='flex-row gap-3'>
              <View style={{ flex: 1 }}>
                <Pressable
                  onPress={handleDonatePress}
                  className='h-14 rounded-2xl items-center justify-center flex-row gap-2'
                  style={{ backgroundColor: colors.vaykaePink }}
                >
                  <Gift size={18} color={colors.background} />
                  <Text className='font-bold' style={{ color: colors.background }}>
                    Donate Now
                  </Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() =>
                  createConversation.mutate(
                    { type: 'direct', participantId: c.creator.id },
                    { onSuccess: (conversation) => router.push('/(traveler)/chat/' + conversation.id) },
                  )
                }
                disabled={createConversation.isPending}
                className='w-14 h-14 rounded-2xl items-center justify-center'
                style={{ borderWidth: 2, borderColor: colors.border }}
              >
                {createConversation.isPending ? (
                  <ActivityIndicator color={colors.vaykaePink} />
                ) : (
                  <MessageCircle size={20} color={colors.foreground} />
                )}
              </Pressable>
              <Pressable
                onPress={() => showInDevelopmentAlert('Saving campaigns isnt available yet.')}
                className='w-14 h-14 rounded-2xl items-center justify-center'
                style={{ borderWidth: 2, borderColor: colors.border }}
              >
                <Heart size={20} color={colors.foreground} />
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      <DonateSheet
        visible={donateSheetVisible}
        campaignId={id}
        onClose={handleDonateClose}
      />
    </SafeAreaView>
  );
}