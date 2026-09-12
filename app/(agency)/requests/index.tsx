import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Avatar } from '../../../src/components/Avatar';
import { RequestStatusBadge } from '../../../src/components/RequestStatusBadge';
import { AgencyBottomNav } from '../../../src/components/AgencyBottomNav';
import { colors, vaykaeGradient } from '../../../src/constants/colors';
import { useAgencyTripRequests } from '../../../src/hooks/use-trip-requests-queries';
import type { TripRequest, TripRequestStatus } from '../../../src/api/types';

type FilterKey = 'all' | 'pending' | 'in_discussion' | 'confirmed_or_completed';

interface FilterCard {
  key: FilterKey;
  label: string;
  activeBg: string;
  activeText: string;
  activeRing: string;
}

const FILTERS: FilterCard[] = [
  { key: 'all', label: 'All', activeBg: 'transparent', activeText: colors.foreground, activeRing: 'transparent' },
  { key: 'pending', label: 'Pending', activeBg: 'rgba(234,179,8,0.1)', activeText: colors.foreground, activeRing: 'rgba(234,179,8,0.3)' },
  { key: 'in_discussion', label: 'Replied', activeBg: 'rgba(59,130,246,0.1)', activeText: colors.foreground, activeRing: 'rgba(59,130,246,0.3)' },
  { key: 'confirmed_or_completed', label: 'Booked', activeBg: 'rgba(34,197,94,0.1)', activeText: colors.foreground, activeRing: 'rgba(34,197,94,0.3)' },
];

const SERVER_STATUS: Record<Exclude<FilterKey, 'all' | 'confirmed_or_completed'>, TripRequestStatus> = {
  pending: 'pending',
  in_discussion: 'in_discussion',
};

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  if (Number.isNaN(diffMs) || diffMs < 0) return '';
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`;
  const yr = Math.floor(day / 365);
  return `${yr} year${yr === 1 ? '' : 's'} ago`;
}

function travelerDisplayName(t: TripRequest['traveler']): string {
  return t.displayName?.trim() ? t.displayName : `@${t.username}`;
}

export default function AgencyRequestsScreen() {
  const [filter, setFilter] = useState<FilterKey>('all');

  // The backend's filter param only accepts a single status. For 'Booked' we
  // want both 'confirmed' and 'completed' together, and 'all' just fetches
  // unfiltered — so only pass a server-side status when the filter maps to
  // exactly one of them. Everything else is filtered client-side below.
  const serverStatus =
    filter === 'pending' || filter === 'in_discussion' ? SERVER_STATUS[filter] : undefined;
  const requestsQuery = useAgencyTripRequests(serverStatus);

  const allItems: TripRequest[] = useMemo(
    () => requestsQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [requestsQuery.data],
  );

  const items = useMemo(() => {
    if (filter === 'all') return allItems;
    if (filter === 'confirmed_or_completed') {
      return allItems.filter((i) => i.status === 'confirmed' || i.status === 'completed');
    }
    return allItems.filter((i) => i.status === filter);
  }, [allItems, filter]);

  const counts = useMemo(() => {
    return {
      all: allItems.length,
      pending: allItems.filter((i) => i.status === 'pending').length,
      in_discussion: allItems.filter((i) => i.status === 'in_discussion').length,
      confirmed_or_completed: allItems.filter(
        (i) => i.status === 'confirmed' || i.status === 'completed',
      ).length,
    } satisfies Record<FilterKey, number>;
  }, [allItems]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-foreground">Travel Requests</Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            Manage incoming trip requests
          </Text>
        </View>

        <View className="flex-row px-6 gap-2 mb-4">
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            const count = counts[f.key];
            const isAll = f.key === 'all';

            const inner = (
              <View
                className="p-3 rounded-2xl"
                style={
                  isAll
                    ? {
                        backgroundColor: isActive ? 'transparent' : colors.inputBackground,
                        borderWidth: 1,
                        borderColor: isActive ? 'transparent' : colors.border,
                      }
                    : {
                        backgroundColor: isActive ? f.activeBg : colors.inputBackground,
                        borderWidth: 1,
                        borderColor: isActive ? f.activeRing : colors.border,
                      }
                }
              >
                <Text
                  className="text-lg font-bold"
                  style={{ color: isAll && isActive ? colors.background : f.activeText }}
                >
                  {count}
                </Text>
                <Text
                  className="text-xs"
                  style={{ color: isAll && isActive ? colors.background : f.activeText }}
                >
                  {f.label}
                </Text>
              </View>
            );

            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={{ flex: 1 }}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                {isAll && isActive ? (
                  <LinearGradient
                    colors={vaykaeGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 16 }}
                  >
                    <View className="p-3 rounded-2xl">
                      <Text className="text-lg font-bold" style={{ color: colors.background }}>
                        {count}
                      </Text>
                      <Text className="text-xs" style={{ color: colors.background }}>
                        {f.label}
                      </Text>
                    </View>
                  </LinearGradient>
                ) : (
                  inner
                )}
              </Pressable>
            );
          })}
        </View>

        {requestsQuery.isLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : requestsQuery.isError ? (
          <View className="py-16 items-center px-6">
            <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
              Couldn&apos;t load your requests.
            </Text>
            <Text
              onPress={() => requestsQuery.refetch()}
              style={{ color: colors.vaykaePink }}
              className="font-semibold"
            >
              Try again
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 96 }}
            ListEmptyComponent={
              <View className="py-16 items-center px-6">
                <Text className="text-lg font-medium mb-2 text-foreground">
                  {filter === 'all'
                    ? 'No trip requests yet'
                    : filter === 'pending'
                      ? 'No pending requests'
                      : filter === 'in_discussion'
                        ? 'No requests in discussion'
                        : 'No confirmed bookings'}
                </Text>
                {filter === 'all' && (
                  <Text
                    className="text-sm text-center"
                    style={{ color: colors.mutedForeground }}
                  >
                    Travelers can send you a request from your agency profile or a package.
                  </Text>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <RequestCard
                request={item}
                onPress={() => router.push(`/(agency)/requests/${item.id}`)}
              />
            )}
          />
        )}

        <AgencyBottomNav active="requests" />
      </View>
    </SafeAreaView>
  );
}

function RequestCard({ request, onPress }: { request: TripRequest; onPress: () => void }) {
  const displayName = travelerDisplayName(request.traveler);
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-4 mx-6 mb-3 bg-card"
      style={{ borderWidth: 1, borderColor: colors.border }}
    >
      <View style={{ position: 'absolute', top: 12, right: 12 }}>
        <RequestStatusBadge status={request.status} size="sm" />
      </View>

      <View className="flex-row items-center mb-3" style={{ paddingRight: 96 }}>
        <Avatar name={displayName} size={40} />
        <View className="ml-3 flex-1 min-w-0">
          <Text className="font-semibold text-foreground" numberOfLines={1}>
            {displayName}
          </Text>
          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            {formatRelativeTime(request.createdAt)}
          </Text>
        </View>
      </View>

      <Text
        className="text-sm mb-2"
        numberOfLines={2}
        style={{ color: colors.foreground }}
      >
        {request.initialMessage}
      </Text>

      {request.package && (
        <Text className="text-xs mt-1" style={{ color: colors.vaykaePink }}>
          Linked to: {request.package.title}
        </Text>
      )}
      {request.campaign && (
        <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
          Campaign: {request.campaign.title}
        </Text>
      )}
    </Pressable>
  );
}
