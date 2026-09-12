import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Settings } from 'lucide-react-native';
import { Avatar } from '../../../src/components/Avatar';
import { RequestStatusBadge } from '../../../src/components/RequestStatusBadge';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { useTripRequest } from '../../../src/hooks/use-trip-requests-queries';
import { useUpdateTripRequestStatus } from '../../../src/hooks/use-trip-requests-mutations';
import { showAlert } from '../../../src/utils/show-alert';
import type { TripRequestStatus } from '../../../src/api/types';

const ALLOWED_TRANSITIONS: Record<TripRequestStatus, TripRequestStatus[]> = {
  pending: ['in_discussion', 'declined'],
  in_discussion: ['confirmed', 'declined'],
  confirmed: ['completed'],
  completed: [],
  declined: [],
  cancelled: [],
};

const STATUS_LABEL: Record<TripRequestStatus, string> = {
  pending: 'Start Discussion',
  in_discussion: 'Confirm Booking',
  confirmed: 'Mark as Completed',
  completed: 'Completed',
  declined: 'Declined',
  cancelled: 'Cancelled',
};

const STATUS_PROMPT_VERB: Record<TripRequestStatus, string> = {
  pending: 'start the discussion',
  in_discussion: 'confirm this booking',
  confirmed: 'mark this booking as completed',
  completed: 'mark as completed',
  declined: 'decline this request',
  cancelled: 'cancel this request',
};

function travelerDisplayName(name: string | null, username: string): string {
  return name?.trim() ? name : `@${username}`;
}

export default function AgencyRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripRequestQuery = useTripRequest(id);
  const updateStatus = useUpdateTripRequestStatus();

  const legalNext = useMemo<TripRequestStatus[]>(() => {
    const status = tripRequestQuery.data?.status;
    if (!status) return [];
    return ALLOWED_TRANSITIONS[status] ?? [];
  }, [tripRequestQuery.data?.status]);

  const goToChat = (conversationId: string) =>
    router.push(`/(agency)/inbox/${conversationId}`);

  const confirmTransition = (nextStatus: TripRequestStatus) => {
    if (!id) return;
    showAlert(
      `${STATUS_LABEL[nextStatus]}?`,
      `Are you sure you want to ${STATUS_PROMPT_VERB[nextStatus]}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: STATUS_LABEL[nextStatus],
          onPress: () => updateStatus.mutate({ id, status: nextStatus }),
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="h-14 flex-row items-center justify-between px-4"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-semibold text-foreground">Request Details</Text>
        <Pressable
          onPress={() => router.push('/(agency)/requests/smart-replies')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Quick replies"
        >
          <Settings size={22} color={colors.foreground} />
        </Pressable>
      </View>

      {tripRequestQuery.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} />
        </View>
      ) : tripRequestQuery.isError || !tripRequestQuery.data ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            Couldn&apos;t load this request.
          </Text>
          <Text
            onPress={() => tripRequestQuery.refetch()}
            style={{ color: colors.vaykaePink }}
            className="font-semibold"
          >
            Try again
          </Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <View
              className="mx-4 mt-4 p-5 rounded-3xl bg-card"
              style={{ borderWidth: 1, borderColor: colors.border }}
            >
              <View className="flex-row items-center">
                <Avatar
                  name={travelerDisplayName(
                    tripRequestQuery.data.traveler.displayName,
                    tripRequestQuery.data.traveler.username,
                  )}
                  size={56}
                />
                <View className="ml-3 flex-1 min-w-0">
                  <Text
                    className="text-lg font-semibold text-foreground"
                    numberOfLines={1}
                  >
                    {travelerDisplayName(
                      tripRequestQuery.data.traveler.displayName,
                      tripRequestQuery.data.traveler.username,
                    )}
                  </Text>
                  {tripRequestQuery.data.conversationId ? (
                    <Pressable
                      onPress={() => goToChat(tripRequestQuery.data!.conversationId!)}
                      hitSlop={8}
                    >
                      <Text
                        className="font-semibold mt-1"
                        style={{ color: colors.vaykaePink }}
                      >
                        Message
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>

            <View className="mx-4 mt-4">
              <Text
                className="text-sm mb-2"
                style={{ color: colors.mutedForeground }}
              >
                Status
              </Text>
              <View>
                <RequestStatusBadge status={tripRequestQuery.data.status} size="md" />
              </View>
            </View>

            <View className="mx-4 mt-6">
              {tripRequestQuery.data.package && (
                <Pressable
                  onPress={() =>
                    router.push(`/(agency)/packages/${tripRequestQuery.data!.package!.id}`)
                  }
                  className="p-4 rounded-2xl bg-card"
                  style={{ borderWidth: 1, borderColor: colors.border }}
                >
                  <Text
                    className="text-xs mb-1"
                    style={{ color: colors.mutedForeground }}
                  >
                    Linked Package
                  </Text>
                  <Text className="text-base font-semibold text-foreground">
                    {tripRequestQuery.data.package.title}
                  </Text>
                  <Text
                    className="text-sm mt-1"
                    style={{ color: colors.mutedForeground }}
                  >
                    {tripRequestQuery.data.package.basePrice.toLocaleString()}{' '}
                    {tripRequestQuery.data.package.currency}
                  </Text>
                </Pressable>
              )}
              {tripRequestQuery.data.campaign && (
                <Pressable
                  onPress={() =>
                    router.push(
                      `/(traveler)/campaigns/${tripRequestQuery.data!.campaign!.id}`,
                    )
                  }
                  className="p-4 rounded-2xl bg-card"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    marginTop: tripRequestQuery.data.package ? 12 : 0,
                  }}
                >
                  <Text
                    className="text-xs mb-1"
                    style={{ color: colors.mutedForeground }}
                  >
                    Linked Campaign
                  </Text>
                  <Text className="text-base font-semibold text-foreground">
                    {tripRequestQuery.data.campaign.title}
                  </Text>
                  <Text
                    className="text-sm mt-1"
                    style={{ color: colors.mutedForeground }}
                  >
                    {tripRequestQuery.data.campaign.destination}
                  </Text>
                </Pressable>
              )}
              {!tripRequestQuery.data.package && !tripRequestQuery.data.campaign && (
                <Text style={{ color: colors.mutedForeground }}>
                  No package or campaign attached.
                </Text>
              )}
            </View>

            <View className="mx-4 mt-6">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Message from traveler
              </Text>
              <View
                className="p-4 rounded-2xl"
                style={{ backgroundColor: colors.inputBackground }}
              >
                <Text className="text-foreground" style={{ lineHeight: 22 }}>
                  {tripRequestQuery.data.initialMessage}
                </Text>
              </View>
            </View>

            <View className="mx-4 mt-6">
              <Text
                className="text-sm"
                style={{ color: colors.mutedForeground }}
              >
                No travel preferences recorded. Use the chat to discuss dates,
                budget, and trip style directly with the traveler.
              </Text>
            </View>
          </ScrollView>

          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 16,
              backgroundColor: colors.background,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            }}
          >
            {legalNext.length === 0 ? (
              <View className="flex-row items-center justify-center py-2">
                <CheckCircle2 size={18} color={colors.mutedForeground} />
                <Text
                  className="ml-2"
                  style={{ color: colors.mutedForeground }}
                >
                  No further actions
                </Text>
              </View>
            ) : (
              <View>
                {tripRequestQuery.data.conversationId && (
                  <View style={{ marginBottom: 12 }}>
                    <GradientButton
                      variant="outline"
                      onPress={() =>
                        goToChat(tripRequestQuery.data!.conversationId!)
                      }
                    >
                      Continue Conversation
                    </GradientButton>
                  </View>
                )}
                {legalNext.includes('in_discussion') && (
                  <View className="flex-row gap-3">
                    <View style={{ flex: 1 }}>
                      <GradientButton
                        onPress={() => confirmTransition('in_discussion')}
                        loading={updateStatus.isPending}
                      >
                        Start Discussion
                      </GradientButton>
                    </View>
                    <View style={{ flex: 1 }}>
                      <GradientButton
                        variant="outline"
                        onPress={() => confirmTransition('declined')}
                      >
                        Decline
                      </GradientButton>
                    </View>
                  </View>
                )}
                {legalNext.includes('confirmed') && legalNext.includes('declined') && (
                  <View className="flex-row gap-3">
                    <View style={{ flex: 1 }}>
                      <GradientButton
                        onPress={() => confirmTransition('confirmed')}
                        loading={updateStatus.isPending}
                      >
                        Confirm Booking
                      </GradientButton>
                    </View>
                    <View style={{ flex: 1 }}>
                      <GradientButton
                        variant="outline"
                        onPress={() => confirmTransition('declined')}
                      >
                        Decline
                      </GradientButton>
                    </View>
                  </View>
                )}
                {legalNext.includes('completed') && (
                  <GradientButton
                    onPress={() => confirmTransition('completed')}
                    loading={updateStatus.isPending}
                  >
                    Mark as Completed
                  </GradientButton>
                )}
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
