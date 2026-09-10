import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TravelerBottomNav } from '../../src/components/TravelerBottomNav';
import { colors, vaykaeGradient } from '../../src/constants/colors';
import { useNotifications, useUnreadCount } from '../../src/hooks/use-notifications-queries';
import { useMarkRead } from '../../src/hooks/use-notifications-mutations';
import type { NotificationListItem } from '../../src/api/types';

const TYPE_ICONS: Record<string, string> = {
  donation: '💎',
  milestone: '🏆',
  agency_response: '✈️',
  chat_message: '💬',
  like: '❤️',
  comment: '💭',
  share: '🔄',
  review_received: '⭐',
  verification_status: '✅',
  account_status: '👤',
  campaign_flagged: '🚩',
  admin_broadcast: '📢',
  new_request: '📋',
  booking_update: '📅',
  payment_received: '💰',
  withdrawal_status: '💸',
  friend_request: '🤝',
  shared_file: '📎',
  new_call: '📞',
  system_alert: '🔔',
};

export default function NotificationsScreen() {
  const notificationsQuery = useNotifications();
  const unreadCountQuery = useUnreadCount();
  const markRead = useMarkRead();

  const notifications = useMemo(() => notificationsQuery.data?.items ?? [], [notificationsQuery.data]);
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  const handlePress = (item: NotificationListItem) => {
    if (!item.read) {
      markRead.mutate(item.id);
    }

    if (item.deepLinkTarget && item.deepLinkEntityId) {
      switch (item.deepLinkTarget) {
        case 'campaign':
          router.push(`/(traveler)/campaigns/${item.deepLinkEntityId}`);
          break;
        case 'profile':
          router.push(`/(traveler)/user/${item.deepLinkEntityId}`);
          break;
        case 'chat':
          router.push(`/(traveler)/chat/${item.deepLinkEntityId}`);
          break;
        default:
          break;
      }
    }
  };

  const renderItem = ({ item }: { item: NotificationListItem }) => {
    const isUnread = !item.read;
    const icon = TYPE_ICONS[item.type] ?? '??';

    return (
      <Pressable
        onPress={() => handlePress(item)}
        className={`px-4 py-3.5 ${isUnread ? 'bg-muted/20' : ''}`}
      >
        <View className="flex-row items-start gap-3">
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: 40,
              height: 40,
            }}
          >
            <LinearGradient
              colors={vaykaeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 20,
              }}
            />
            <Text style={{ fontSize: 18 }}>{icon}</Text>
          </View>

          <View className="flex-1 min-w-0">
            <Text className={`text-sm ${isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground'}`} numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={2}>
              {item.body}
            </Text>
            <Text className="text-xs text-muted-foreground mt-1">
              {formatTimestamp(item.createdAt)}
            </Text>
          </View>

          {isUnread && (
            <View
              className="rounded-full mt-1"
              style={{ width: 8, height: 8, backgroundColor: colors.vaykaePink }}
            />
          )}
        </View>
      </Pressable>
    );
  };

  if (notificationsQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <NotificationsHeader />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.vaykaePink} size="large" />
        </View>
        <TravelerBottomNav active="profile" />
      </SafeAreaView>
    );
  }

  if (notificationsQuery.isError) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <NotificationsHeader />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            Couldn&apos;t load your notifications.
          </Text>
          <Pressable onPress={() => notificationsQuery.refetch()}>
            <Text style={{ color: colors.vaykaePink }} className="font-semibold">
              Try again
            </Text>
          </Pressable>
        </View>
        <TravelerBottomNav active="profile" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <NotificationsHeader unreadCount={unreadCount} />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-6 pt-16">
            <Bell size={48} color={colors.mutedForeground} />
            <Text className="text-base font-semibold text-foreground mt-4 mb-1">
              No notifications
            </Text>
            <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
              You&apos;re all caught up! New notifications will appear here.
            </Text>
          </View>
        }
        renderItem={renderItem}
      />
      <TravelerBottomNav active="profile" />
    </SafeAreaView>
  );
}

function NotificationsHeader({ unreadCount }: { unreadCount?: number }) {
  return (
    <View
      className="flex-row items-center px-4 h-14"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <Text className="text-foreground text-lg">←</Text>
      </Pressable>
      <Text className="text-lg font-bold text-foreground ml-3">Notifications</Text>
      {typeof unreadCount === 'number' && unreadCount > 0 && (
        <View
          className="ml-2 px-2 py-0.5 rounded-full"
          style={{ backgroundColor: colors.vaykaePink }}
        >
          <Text className="text-xs font-bold text-white">{unreadCount}</Text>
        </View>
      )}
    </View>
  );
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
