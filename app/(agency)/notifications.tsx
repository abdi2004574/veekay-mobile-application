import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, CheckCircle2, DollarSign, MessageCircle, Package, Star, TrendingUp, UserPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AgencyBottomNav } from '../../src/components/AgencyBottomNav';
import { colors, vaykaeGradient } from '../../src/constants/colors';
import { useNotifications, useUnreadCount } from '../../src/hooks/use-notifications-queries';
import { useMarkRead, useMarkAllRead } from '../../src/hooks/use-notifications-mutations';
import type { NotificationListItem } from '../../src/api/types';

type Filter = 'all' | 'unread';

const TYPE_CONFIG: Record<string, { icon: typeof MessageCircle; color: string }> = {
  message: { icon: MessageCircle, color: '#D701A8' },
  new_request: { icon: Package, color: '#7700C6' },
  payment_received: { icon: DollarSign, color: '#10B981' },
  review_received: { icon: Star, color: '#F59E0B' },
  booking_update: { icon: CheckCircle2, color: '#10B981' },
  system_alert: { icon: TrendingUp, color: '#6366F1' },
  friend_request: { icon: UserPlus, color: '#D701A8' },
  admin_broadcast: { icon: Bell, color: '#7700C6' },
  default: { icon: Bell, color: '#717182' },
};

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const notificationsQuery = useNotifications();
  const unreadCountQuery = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const notifications = notificationsQuery.data?.items ?? [];
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  const filtered =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const handlePress = (item: NotificationListItem) => {
    if (!item.read) {
      markRead.mutate(item.id);
    }

    switch (item.deepLinkTarget) {
      case 'requests':
        router.replace('/(agency)/requests');
        break;
      case 'inbox':
        router.replace('/(agency)/inbox');
        break;
      case 'packages':
        router.replace('/(agency)/packages');
        break;
      default:
        break;
    }
  };

  if (notificationsQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <Header unreadCount={unreadCount} onMarkAllRead={() => {}} filter={filter} onFilterChange={setFilter} totalCount={notifications.length} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} size="large" />
        </View>
        <AgencyBottomNav active="home" />
      </SafeAreaView>
    );
  }

  if (notificationsQuery.isError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <Header unreadCount={unreadCount} onMarkAllRead={() => {}} filter={filter} onFilterChange={setFilter} totalCount={notifications.length} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            Couldn&apos;t load notifications.
          </Text>
          <Pressable onPress={() => notificationsQuery.refetch()}>
            <Text style={{ color: colors.vaykaePink }} className="font-semibold">
              Try again
            </Text>
          </Pressable>
        </View>
        <AgencyBottomNav active="home" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Header
        unreadCount={unreadCount}
        onMarkAllRead={() => markAllRead.mutate()}
        filter={filter}
        onFilterChange={setFilter}
        totalCount={notifications.length}
      />
      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Bell size={48} color={colors.mutedForeground} />
          <Text className="text-base font-semibold text-foreground mt-4 mb-1">No notifications</Text>
          <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
            {filter === 'unread'
              ? "You&apos;re all caught up! No unread notifications."
              : "You don't have any notifications yet."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const config = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.default;
            const Icon = config.icon;
            const isUnread = !item.read;

            return (
              <Pressable
                onPress={() => handlePress(item)}
                className={`px-4 py-3.5 ${isUnread ? 'bg-muted/20' : ''}`}
              >
                <View className="flex-row items-start gap-3">
                  <View
                    className="items-center justify-center rounded-2xl"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: `${config.color}15`,
                    }}
                  >
                    <Icon size={24} color={config.color} />
                  </View>

                  <View className="flex-1 min-w-0">
                    <View className="flex items-start justify-between gap-2 mb-1">
                      <Text className={`text-sm ${isUnread ? 'font-semibold text-foreground' : 'font-normal text-foreground'}`} numberOfLines={1}>
                        {item.title}
                      </Text>
                      {isUnread && (
                        <View
                          className="rounded-full mt-1"
                          style={{ width: 8, height: 8, backgroundColor: colors.vaykaePink }}
                        />
                      )}
                    </View>
                    <Text className="text-xs text-muted-foreground mb-1" numberOfLines={2}>
                      {item.body}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {formatTimestamp(item.createdAt)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
      <AgencyBottomNav active="home" />
    </SafeAreaView>
  );
}

function Header({
  unreadCount,
  onMarkAllRead,
  filter,
  onFilterChange,
  totalCount,
}: {
  unreadCount: number;
  onMarkAllRead: () => void;
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  totalCount: number;
}) {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text className="text-foreground text-lg">←</Text>
          </Pressable>
          <View>
            <Text className="text-lg font-semibold text-foreground">Notifications</Text>
            {unreadCount > 0 && (
              <Text className="text-xs text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={onMarkAllRead}>
            <Text className="text-sm font-medium" style={{ color: colors.vaykaePink }}>
              Mark all read
            </Text>
          </Pressable>
        )}
      </View>
      <View className="flex-row gap-2 px-4 pb-3">
        <FilterTab
          label={`All (${totalCount})`}
          active={filter === 'all'}
          onPress={() => onFilterChange('all')}
        />
        <FilterTab
          label={`Unread (${unreadCount})`}
          active={filter === 'unread'}
          onPress={() => onFilterChange('unread')}
        />
      </View>
    </View>
  );
}

function FilterTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      {active ? (
        <LinearGradient colors={vaykaeGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 12 }}>
          <View className="px-4 py-2">
            <Text className="text-sm font-medium text-white">{label}</Text>
          </View>
        </LinearGradient>
      ) : (
        <View
          className="px-4 py-2 rounded-xl"
          style={{ backgroundColor: colors.disabledBackground }}
        >
          <Text className="text-sm font-medium" style={{ color: colors.mutedForeground }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
