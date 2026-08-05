import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Edit2, Eye, Gift, Plus, Trash2, TrendingUp, Users } from 'lucide-react-native';
import { TravelerBottomNav } from '../../../src/components/TravelerBottomNav';
import { BOTTOM_NAV_HEIGHT } from '../../../src/components/BottomNavBar';
import { GradientButton } from '../../../src/components/GradientButton';
import { CampaignProgressBar } from '../../../src/components/CampaignProgressBar';
import { colors } from '../../../src/constants/colors';
import { useMyCampaigns } from '../../../src/hooks/use-campaigns-queries';
import { useDeleteCampaign } from '../../../src/hooks/use-campaigns-mutations';
import { showAlert } from '../../../src/utils/show-alert';
import { showInDevelopmentAlert } from '../../../src/utils/in-development';
import type { Campaign } from '../../../src/api/types';

type Tab = 'campaigns' | 'gifts';

export default function CampaignsScreen() {
  const [tab, setTab] = useState<Tab>('campaigns');
  const campaigns = useMyCampaigns();
  const deleteCampaign = useDeleteCampaign();
  const insets = useSafeAreaInsets();

  const items = useMemo(() => campaigns.data ?? [], [campaigns.data]);
  const active = useMemo(() => items.filter((c) => c.status === 'active'), [items]);
  const completed = useMemo(() => items.filter((c) => c.status === 'completed'), [items]);

  const confirmDelete = (campaignId: string) => {
    showAlert('Delete campaign?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCampaign.mutate(campaignId) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <Text className="text-xl font-bold text-foreground px-4 pt-3 pb-1">Campaigns</Text>

        <View className="flex-row gap-2 p-1 mx-4 mt-3 mb-1 rounded-2xl" style={{ backgroundColor: colors.inputBackground }}>
          {(
            [
              { key: 'campaigns', label: `My Campaigns (${items.length})` },
              { key: 'gifts', label: 'Gifts (0)' },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={{ flex: 1 }}>
              <View
                className="py-2.5 rounded-xl items-center"
                style={{ backgroundColor: tab === t.key ? colors.vaykaePink : 'transparent' }}
              >
                <Text
                  className="font-bold text-sm"
                  style={{ color: tab === t.key ? colors.background : colors.mutedForeground }}
                >
                  {t.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {campaigns.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : campaigns.isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
              Couldn&apos;t load your campaigns.
            </Text>
            <Pressable onPress={() => campaigns.refetch()}>
              <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                Try again
              </Text>
            </Pressable>
          </View>
        ) : tab === 'gifts' ? (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 32 }}>
            <View className="items-center py-16">
              <Gift size={48} color={colors.mutedForeground} />
              <Text className="text-center mt-3 mb-1 text-foreground font-medium">
                No gift contributions yet
              </Text>
              <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                Enable Gift Mode on your campaigns to receive gifts
              </Text>
            </View>
          </ScrollView>
        ) : items.length === 0 ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 32 }}>
            <View className="flex-1 items-center justify-center py-16">
              <TrendingUp size={48} color={colors.mutedForeground} />
              <Text className="text-center mt-3 mb-1 text-foreground font-medium">No campaigns yet</Text>
              <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                Tap the + button to create your first campaign
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 32, gap: 24 }}>
            {active.length > 0 && (
              <View>
                <View className="flex-row items-center gap-2 mb-3">
                  <TrendingUp size={18} color={colors.vaykaePink} />
                  <Text className="font-bold text-foreground">Active Campaigns</Text>
                </View>
                <View style={{ gap: 12 }}>
                  {active.map((c) => (
                    <CampaignCard
                      key={c.id}
                      campaign={c}
                      onDelete={() => confirmDelete(c.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {completed.length > 0 && (
              <View>
                <Text className="font-bold text-foreground mb-3">Completed Campaigns</Text>
                <View style={{ gap: 12 }}>
                  {completed.map((c) => (
                    <View
                      key={c.id}
                      className="rounded-2xl overflow-hidden"
                      style={{ borderWidth: 1, borderColor: '#bbf7d0' }}
                    >
                      <CampaignHero campaign={c} badgeText="✓ Completed" badgeColor="#dcfce7" badgeTextColor="#15803d" />
                      <View className="p-4">
                        <Text className="font-bold text-foreground mb-1">{c.title}</Text>
                        <Text className="text-sm mb-3" style={{ color: colors.mutedForeground }}>
                          {c.contributorsCount} contributors • ${c.goalAmount.toLocaleString()} raised
                        </Text>
                        <GradientButton
                          onPress={() =>
                            showInDevelopmentAlert('Withdrawals aren’t available yet.')
                          }
                        >
                          View Withdrawal Options
                        </GradientButton>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        )}

        <Pressable
          onPress={() => router.push('/(traveler)/campaigns/create')}
          style={{
            position: 'absolute',
            right: 20,
            bottom: BOTTOM_NAV_HEIGHT + insets.bottom + 16,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.vaykaePink,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Plus size={26} color={colors.background} />
        </Pressable>

        <TravelerBottomNav active="campaigns" />
      </View>
    </SafeAreaView>
  );
}

function CampaignHero({
  campaign,
  badgeText,
  badgeColor,
  badgeTextColor,
}: {
  campaign: Campaign;
  badgeText: string;
  badgeColor: string;
  badgeTextColor: string;
}) {
  const heroUrl = campaign.photos[0]?.url;
  return (
    <Pressable onPress={() => router.push(`/(traveler)/campaigns/${campaign.id}`)}>
      {heroUrl ? (
        <Image source={{ uri: heroUrl }} style={{ width: '100%', aspectRatio: 16 / 9 }} resizeMode="cover" />
      ) : (
        <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.inputBackground }} />
      )}
      <View style={{ position: 'absolute', top: 12, left: 12 }}>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: badgeColor }}>
          <Text className="text-xs font-bold" style={{ color: badgeTextColor }}>
            {badgeText}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function CampaignCard({ campaign, onDelete }: { campaign: Campaign; onDelete: () => void }) {
  const heroUrl = campaign.photos[0]?.url;

  return (
    <View className="rounded-2xl overflow-hidden bg-card" style={{ borderWidth: 1, borderColor: colors.border }}>
      <Pressable onPress={() => router.push(`/(traveler)/campaigns/${campaign.id}`)}>
        {heroUrl ? (
          <Image source={{ uri: heroUrl }} style={{ width: '100%', aspectRatio: 16 / 9 }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.inputBackground }} />
        )}
        <View style={{ position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 }}>
          <View className="px-2 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
            {campaign.privacy === 'public' && <Eye size={12} color={colors.foreground} />}
            <Text className="text-xs font-bold text-foreground">
              {campaign.privacy === 'public' ? 'Public' : 'Private'}
            </Text>
          </View>
          {campaign.giftMode && (
            <View className="px-2 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: colors.vaykaePink }}>
              <Gift size={12} color={colors.background} />
              <Text className="text-xs font-bold" style={{ color: colors.background }}>
                Gift Mode
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      <View className="p-4">
        <View className="flex-row items-start justify-between mb-3">
          <View style={{ flex: 1 }}>
            <Text className="font-bold text-foreground mb-1">{campaign.title}</Text>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              {campaign.destination}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(traveler)/campaigns/create',
                  params: {
                    editCampaignId: campaign.id,
                    editTitle: campaign.title,
                    editDestination: campaign.destination,
                    editGoalAmount: String(campaign.goalAmount),
                    editTripStartDate: campaign.tripStartDate.slice(0, 10),
                    editTripEndDate: campaign.tripEndDate ? campaign.tripEndDate.slice(0, 10) : '',
                    editStory: campaign.story ?? '',
                    editPrivacy: campaign.privacy,
                    editGiftMode: campaign.giftMode ? '1' : '0',
                    editGiftOccasion: campaign.giftOccasion ?? '',
                    editPhotoMediaIds: campaign.photos.map((p) => p.mediaId).join(','),
                    editPhotoUrls: campaign.photos.map((p) => p.url ?? '').join(','),
                    editItineraryMediaId: campaign.itineraryMediaId ?? '',
                    editAgencyQuoteMediaId: campaign.agencyQuoteMediaId ?? '',
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
              onPress={onDelete}
              hitSlop={6}
              className="items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, backgroundColor: '#fef2f2' }}
            >
              <Trash2 size={16} color={colors.destructive} />
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-2 mb-3">
          <StatTile label="Contributors" value={String(campaign.contributorsCount)} icon={Users} />
          <StatTile label="Views" value={String(campaign.viewsCount)} icon={Eye} />
          {/* Raised amount is always $0 until Payments/Donations (#6) exists. */}
          <StatTile label="Progress" value="0%" />
        </View>

        <View className="mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="font-bold text-foreground">$0</Text>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              of ${campaign.goalAmount.toLocaleString()}
            </Text>
          </View>
          <CampaignProgressBar raised={0} goal={campaign.goalAmount} />
        </View>

        <Pressable
          onPress={() => router.push(`/(traveler)/campaigns/${campaign.id}`)}
          className="h-11 rounded-xl items-center justify-center"
          style={{ backgroundColor: colors.inputBackground }}
        >
          <Text className="font-bold text-foreground">View Campaign Details</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StatTile({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <View className="flex-1 p-2 rounded-xl items-center" style={{ backgroundColor: colors.inputBackground }}>
      <Text className="text-xs mb-0.5" style={{ color: colors.mutedForeground }}>
        {label}
      </Text>
      <View className="flex-row items-center gap-1">
        {Icon && <Icon size={13} color={colors.foreground} />}
        <Text className="font-bold text-sm text-foreground">{value}</Text>
      </View>
    </View>
  );
}
