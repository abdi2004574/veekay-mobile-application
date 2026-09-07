import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Link2,
  MessageCircle,
  Package as PackageIcon,
  Plus,
  Star,
  Unlink,
} from 'lucide-react-native';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { usePackage } from '../../../src/hooks/use-packages-queries';
import {
  useLinkPackageToCampaign,
  useUnlinkPackageFromCampaign,
} from '../../../src/hooks/use-package-link-mutations';
import { useMyCampaigns } from '../../../src/hooks/use-campaigns-queries';
import { useCreateConversation } from '../../../src/hooks/use-chat-mutations';
import { showAlert } from '../../../src/utils/show-alert';
import { showInDevelopmentAlert } from '../../../src/utils/in-development';
import type { Campaign } from '../../../src/api/types';

const DESTINATION_LABELS: Record<string, string> = {
  beach: 'Beach',
  mountain: 'Mountain',
  city: 'City',
  adventure: 'Adventure',
  cruise: 'Cruise',
};

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const packageId = id ?? '';

  const pkgQuery = usePackage(packageId);
  const myCampaigns = useMyCampaigns();
  const linkMutation = useLinkPackageToCampaign();
  const unlinkMutation = useUnlinkPackageFromCampaign();
  const createConversation = useCreateConversation();

  const pkg = pkgQuery.data;

  const [linkedIds, setLinkedIds] = useState<Set<string>>(new Set());

  const activeCampaigns = (myCampaigns.data ?? []).filter((c) => c.status === 'active');

  const onLink = (campaignId: string) => {
    setLinkedIds((prev) => new Set(prev).add(campaignId));
    linkMutation.mutate(
      { packageId, campaignId },
      {
        onError: () => {
          setLinkedIds((prev) => {
            const next = new Set(prev);
            next.delete(campaignId);
            return next;
          });
        },
      },
    );
  };

  const onUnlink = (campaignId: string) => {
    setLinkedIds((prev) => {
      const next = new Set(prev);
      next.delete(campaignId);
      return next;
    });
    unlinkMutation.mutate(
      { packageId, campaignId },
      {
        onError: () => {
          setLinkedIds((prev) => new Set(prev).add(campaignId));
        },
      },
    );
  };

  const onMessageAgency = () => {
    if (!pkg?.agency?.id) {
      showInDevelopmentAlert('This package has no agency attached.');
      return;
    }
    createConversation.mutate(
      { type: 'agency', agencyId: pkg.agency.id },
      {
        onSuccess: (conversation) => router.push(`/(traveler)/chat/${conversation.id}`),
      },
    );
  };

  if (pkgQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} />
        </View>
      </SafeAreaView>
    );
  }

  if (pkgQuery.isError || !pkg) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <Header />
        <View className="flex-1 items-center justify-center px-8">
          <PackageIcon size={48} color={colors.mutedForeground} />
          <Text className="text-lg font-bold text-foreground mt-4 mb-2 text-center">
            This package is no longer available
          </Text>
          <Text className="text-center" style={{ color: colors.mutedForeground }}>
            It may have been archived or removed by the agency.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const heroUrl = pkg.media?.[0]?.url ?? null;
  const agencyName = pkg.agency?.agencyName ?? '';
  const reputation = pkg.agency?.reputationScore ?? null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} bounces={false}>
        <View style={{ position: 'relative' }}>
          {heroUrl ? (
            <Image
              source={{ uri: heroUrl }}
              style={{ width: '100%', aspectRatio: 4 / 3 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: '100%',
                aspectRatio: 4 / 3,
                backgroundColor: colors.inputBackground,
              }}
            />
          )}
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color="#ffffff" />
          </Pressable>
        </View>

        <View className="px-4 pt-4">
          {agencyName ? (
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                by {agencyName}
              </Text>
              {reputation !== null ? (
                <View className="flex-row items-center gap-1">
                  <Star size={12} color={colors.starGold} fill={colors.starGold} />
                  <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                    {reputation.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          <Text className="text-2xl font-bold text-foreground mb-3">{pkg.title}</Text>

          <Text className="text-3xl font-bold mb-4" style={{ color: colors.vaykaePink }}>
            ${pkg.basePrice.toLocaleString()}
            <Text className="text-sm font-normal" style={{ color: colors.mutedForeground }}>
              {' '}
              {pkg.currency}
            </Text>
          </Text>

          {pkg.description ? (
            <Text className="text-sm leading-6 mb-4" style={{ color: colors.foreground }}>
              {pkg.description}
            </Text>
          ) : null}

          <View className="flex-row flex-wrap gap-2 mb-4">
            <MetaChip
              label="Destination"
              value={pkg.destinationType ? DESTINATION_LABELS[pkg.destinationType] ?? pkg.destinationType : null}
            />
            <MetaChip label="Season" value={pkg.season} />
            <MetaChip label="Theme" value={pkg.theme} />
            <MetaChip label="Status" value={pkg.status} />
          </View>

          {pkg.itinerary ? (
            <View className="mb-4">
              <Text className="font-bold text-foreground mb-2">Itinerary</Text>
              <View
                className="p-4 rounded-2xl"
                style={{ backgroundColor: colors.inputBackground }}
              >
                <Text className="text-sm leading-6" style={{ color: colors.foreground }}>
                  {pkg.itinerary}
                </Text>
              </View>
            </View>
          ) : null}

          <View
            className="p-4 rounded-2xl mb-4"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-bold text-foreground">Link to a campaign</Text>
              <Link2 size={16} color={colors.vaykaePink} />
            </View>
            <Text className="text-xs mb-3" style={{ color: colors.mutedForeground }}>
              Add this package to one of your active campaigns so donors can see the planned trip.
            </Text>
            {myCampaigns.isLoading ? (
              <View className="py-3 items-center">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : activeCampaigns.length === 0 ? (
              <View className="py-3">
                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                  You don&apos;t have any active campaigns yet.
                </Text>
                <Pressable
                  onPress={() => router.push('/(traveler)/campaigns/create')}
                  className="mt-3 h-11 rounded-xl items-center justify-center flex-row gap-2"
                  style={{ backgroundColor: colors.inputBackground }}
                >
                  <Plus size={16} color={colors.foreground} />
                  <Text className="font-semibold text-foreground">Create a campaign</Text>
                </Pressable>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {activeCampaigns.map((c) => (
                    <LinkCampaignChip
                      key={c.id}
                      campaign={c}
                      linked={linkedIds.has(c.id)}
                      loading={
                        (linkMutation.isPending &&
                          linkMutation.variables?.campaignId === c.id) ||
                        (unlinkMutation.isPending &&
                          unlinkMutation.variables?.campaignId === c.id)
                      }
                      onLink={() => onLink(c.id)}
                      onUnlink={() =>
                        showAlert('Unlink package?', 'Remove this package from the campaign?', [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Unlink', style: 'destructive', onPress: () => onUnlink(c.id) },
                        ])
                      }
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          <GradientButton onPress={onMessageAgency} loading={createConversation.isPending}>
            Message Agency
          </GradientButton>

          {createConversation.isPending ? null : (
            <View className="flex-row items-center justify-center mt-2 gap-1">
              <MessageCircle size={12} color={colors.mutedForeground} />
              <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                Starts a conversation with {agencyName || 'this agency'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View
      className="flex-row items-center px-4 h-14"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <ArrowLeft size={20} color={colors.foreground} />
      </Pressable>
      <Text className="text-lg font-bold text-foreground ml-3">Package</Text>
    </View>
  );
}

function MetaChip({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <View
      className="px-3 py-1.5 rounded-full"
      style={{ backgroundColor: colors.inputBackground }}
    >
      <Text className="text-xs" style={{ color: colors.mutedForeground }}>
        {label}: <Text className="font-semibold text-foreground">{value}</Text>
      </Text>
    </View>
  );
}

function LinkCampaignChip({
  campaign,
  linked,
  loading,
  onLink,
  onUnlink,
}: {
  campaign: Campaign;
  linked: boolean;
  loading: boolean;
  onLink: () => void;
  onUnlink: () => void;
}) {
  return (
    <View
      className="p-3 rounded-2xl"
      style={{
        width: 200,
        backgroundColor: colors.inputBackground,
      }}
    >
      <Text className="text-sm font-semibold text-foreground mb-1" numberOfLines={1}>
        {campaign.title}
      </Text>
      <Text className="text-xs mb-2" style={{ color: colors.mutedForeground }} numberOfLines={1}>
        {campaign.destination}
      </Text>
      {linked ? (
        <Pressable
          onPress={onUnlink}
          disabled={loading}
          hitSlop={6}
          className="h-9 rounded-xl flex-row items-center justify-center gap-1"
          style={{ backgroundColor: '#dcfce7' }}
        >
          {loading ? (
            <ActivityIndicator color="#15803d" size="small" />
          ) : (
            <>
              <Check size={14} color="#15803d" />
              <Text className="text-xs font-bold" style={{ color: '#15803d' }}>
                Linked
              </Text>
              <Unlink size={12} color="#15803d" style={{ marginLeft: 4 }} />
            </>
          )}
        </Pressable>
      ) : (
        <Pressable
          onPress={onLink}
          disabled={loading}
          hitSlop={6}
          className="h-9 rounded-xl flex-row items-center justify-center gap-1"
          style={{ backgroundColor: colors.vaykaePink }}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <>
              <Plus size={14} color={colors.background} />
              <Text className="text-xs font-bold" style={{ color: colors.background }}>
                Link
              </Text>
            </>
          )}
        </Pressable>
      )}
    </View>
  );
}

