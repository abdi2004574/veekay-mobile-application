import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, UserPlus } from 'lucide-react-native';
import { FriendCard } from '../../src/components/FriendCard';
import { Avatar } from '../../src/components/Avatar';
import { colors } from '../../src/constants/colors';
import { useFriends, useIncomingFriendRequests } from '../../src/hooks/use-friends-queries';
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useUnfriend,
} from '../../src/hooks/use-friend-mutations';

type Tab = 'friends' | 'requests';

export default function FriendsScreen() {
  const [tab, setTab] = useState<Tab>('friends');
  const friends = useFriends();
  const requests = useIncomingFriendRequests();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();
  const unfriend = useUnfriend();

  const requestCount = requests.data?.length ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View
        className="flex-row items-center justify-between px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground">Friends</Text>
        <Pressable onPress={() => router.push('/(traveler)/add-friend')} hitSlop={8}>
          <UserPlus size={20} color={colors.vaykaePink} />
        </Pressable>
      </View>

      <View className="flex-row px-4 mt-3 gap-6" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {(['friends', 'requests'] as Tab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} className="pb-3">
            <Text
              className="font-semibold"
              style={{ color: tab === t ? colors.vaykaePink : colors.mutedForeground }}
            >
              {t === 'friends' ? `Friends (${friends.data?.length ?? 0})` : `Requests (${requestCount})`}
            </Text>
            {tab === t && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  backgroundColor: colors.vaykaePink,
                }}
              />
            )}
          </Pressable>
        ))}
      </View>

      {tab === 'friends' ? (
        friends.isLoading ? (
          <View className="py-16 items-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : friends.isError ? (
          <View className="py-16 items-center px-6">
            <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
              Couldn&apos;t load your friends.
            </Text>
            <Pressable onPress={() => friends.refetch()}>
              <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                Try again
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={friends.data ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <View className="py-16 items-center px-6">
                <Text className="text-center font-semibold text-foreground mb-1">
                  No friends yet
                </Text>
                <Text className="text-center" style={{ color: colors.mutedForeground }}>
                  Search for travelers to add as friends.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <FriendCard friend={item} onRemove={(friend) => unfriend.mutate(friend.id)} />
            )}
          />
        )
      ) : requests.isLoading ? (
        <View className="py-16 items-center">
          <ActivityIndicator color={colors.vaykaePink} />
        </View>
      ) : requests.isError ? (
        <View className="py-16 items-center px-6">
          <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
            Couldn&apos;t load friend requests.
          </Text>
          <Pressable onPress={() => requests.refetch()}>
            <Text style={{ color: colors.vaykaePink }} className="font-semibold">
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={requests.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="py-16 items-center px-6">
              <Text className="text-center" style={{ color: colors.mutedForeground }}>
                No pending friend requests.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const name = item.requester.displayName ?? `@${item.requester.username}`;
            return (
              <View
                className="flex-row items-center gap-3 rounded-2xl px-4 py-3 mb-3"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <Avatar name={name} size={44} />
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">{name}</Text>
                  <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                    @{item.requester.username}
                  </Text>
                </View>
                <Pressable
                  onPress={() => declineRequest.mutate(item.id)}
                  className="px-3 py-2 rounded-full mr-2"
                  style={{ backgroundColor: colors.inputBackground }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.mutedForeground }}>
                    Decline
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => acceptRequest.mutate(item.id)}
                  className="px-3 py-2 rounded-full"
                  style={{ backgroundColor: colors.vaykaePink }}
                >
                  <Text className="text-xs font-semibold" style={{ color: colors.background }}>
                    Accept
                  </Text>
                </Pressable>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
