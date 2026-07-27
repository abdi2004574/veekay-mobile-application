import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import { useCreateConversation } from '../hooks/use-chat-mutations';
import type { FriendUser } from '../api/types';

interface FriendCardProps {
  friend: FriendUser;
  onRemove?: (friend: FriendUser) => void;
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const name = friend.displayName ?? `@${friend.username}`;
  const createConversation = useCreateConversation();

  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl px-4 py-3 mb-3"
      style={{ borderWidth: 1, borderColor: colors.border }}
    >
      <Pressable
        className="flex-row items-center gap-3 flex-1"
        onPress={() => router.push(`/(traveler)/user/${friend.id}`)}
      >
        <Avatar name={name} size={48} />
        <View className="flex-1">
          <Text className="font-semibold text-foreground">{name}</Text>
          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            @{friend.username}
          </Text>
        </View>
      </Pressable>
      <Pressable
        hitSlop={8}
        disabled={createConversation.isPending}
        onPress={() =>
          createConversation.mutate(
            { type: 'direct', participantId: friend.id },
            { onSuccess: (conversation) => router.push(`/(traveler)/chat/${conversation.id}`) },
          )
        }
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.inputBackground,
        }}
      >
        {createConversation.isPending ? (
          <ActivityIndicator size="small" color={colors.vaykaePink} />
        ) : (
          <MessageCircle size={18} color={colors.vaykaePink} />
        )}
      </Pressable>
      {onRemove && (
        <Pressable
          hitSlop={8}
          className="ml-2"
          onPress={() =>
            Alert.alert('Remove friend?', `Remove ${name} from your friends?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Remove', style: 'destructive', onPress: () => onRemove(friend) },
            ])
          }
        >
          <Text className="text-xs font-medium" style={{ color: colors.destructive }}>
            Remove
          </Text>
        </Pressable>
      )}
    </View>
  );
}
