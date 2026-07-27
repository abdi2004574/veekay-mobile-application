import { Pressable, Text, View } from 'react-native';
import { Briefcase, Users } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import type { ConversationSummary } from '../api/types';

function formatTime(iso: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ChatListRow({
  conversation,
  onPress,
}: {
  conversation: ConversationSummary;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View style={{ position: 'relative' }}>
        <Avatar name={conversation.title} size={56} />
        {conversation.type === 'group' && (
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: colors.vaykaePink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={11} color={colors.background} />
          </View>
        )}
        {conversation.type === 'agency' && (
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: colors.vaykaePink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase size={11} color={colors.background} />
          </View>
        )}
        {conversation.unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              paddingHorizontal: 5,
              backgroundColor: colors.vaykaePink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.background, fontSize: 11, fontWeight: '600' }}>
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 min-w-0">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-2 flex-1 min-w-0">
            <Text
              className="font-medium text-foreground flex-1"
              numberOfLines={1}
              style={{ fontWeight: conversation.unreadCount > 0 ? '700' : '500' }}
            >
              {conversation.title}
            </Text>
            {conversation.type === 'group' && conversation.memberCount ? (
              <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                ({conversation.memberCount})
              </Text>
            ) : null}
          </View>
          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            {formatTime(conversation.lastMessageAt)}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 13,
            color: conversation.unreadCount > 0 ? colors.foreground : colors.mutedForeground,
            fontWeight: conversation.unreadCount > 0 ? '600' : '400',
          }}
        >
          {conversation.lastMessage ?? 'No messages yet'}
        </Text>
      </View>
    </Pressable>
  );
}
