import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, UserCheck, UserPlus } from 'lucide-react-native';
import { Avatar } from '../../../src/components/Avatar';
import { PostCard } from '../../../src/components/PostCard';
import { GradientButton } from '../../../src/components/GradientButton';
import { colors } from '../../../src/constants/colors';
import { useAuthStore } from '../../../src/stores/auth-store';
import { useMe, useUserProfile } from '../../../src/hooks/use-users-queries';
import { useUserPosts } from '../../../src/hooks/use-feed-queries';
import { useDeletePost } from '../../../src/hooks/use-feed-mutations';
import { useSendFriendRequest } from '../../../src/hooks/use-friend-mutations';
import { showInDevelopmentAlert } from '../../../src/utils/in-development';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id) ?? '';
  const logout = useAuthStore((s) => s.logout);
  const isSelf = id === currentUserId;

  const me = useMe();
  const otherProfile = useUserProfile(isSelf ? '' : id);
  const posts = useUserPosts(id);
  const deletePost = useDeletePost();
  const sendRequest = useSendFriendRequest();

  const items = useMemo(() => posts.data?.pages.flatMap((p) => p.items) ?? [], [posts.data]);

  const profile = isSelf ? me.data : otherProfile.data;
  const isLoading = isSelf ? me.isLoading : otherProfile.isLoading;
  const isError = isSelf ? me.isError : otherProfile.isError;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color={colors.vaykaePink} />
      </SafeAreaView>
    );
  }

  if (isError || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
          Couldn&apos;t load this profile.
        </Text>
        <Pressable onPress={() => (isSelf ? me.refetch() : otherProfile.refetch())}>
          <Text style={{ color: colors.vaykaePink }} className="font-semibold">
            Try again
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const name = profile.displayName ?? `@${profile.username}`;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={20} color={colors.foreground} />
        </Pressable>
        <Text className="text-lg font-bold text-foreground ml-3">@{profile.username}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        ListHeaderComponent={
          <View className="items-center mb-6">
            <Avatar name={name} size={88} />
            <Text className="text-xl font-bold text-foreground mt-3">{name}</Text>
            {'bio' in profile && profile.bio && (
              <Text className="text-center mt-1" style={{ color: colors.foreground }}>
                {profile.bio}
              </Text>
            )}
            {'location' in profile && profile.location && (
              <View className="flex-row items-center gap-1 mt-1">
                <MapPin size={14} color={colors.mutedForeground} />
                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                  {profile.location}
                </Text>
              </View>
            )}

            {!isSelf && 'mutualFriendsCount' in profile && profile.mutualFriendsCount > 0 && (
              <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                {profile.mutualFriendsCount} mutual friend
                {profile.mutualFriendsCount > 1 ? 's' : ''}
              </Text>
            )}

            <View className="flex-row gap-8 mt-4">
              <Pressable
                className="items-center"
                onPress={() => isSelf && router.push('/(traveler)/friends')}
              >
                <Text className="font-bold text-foreground">{profile.friendsCount}</Text>
                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                  Friends
                </Text>
              </Pressable>
              <View className="items-center">
                <Text className="font-bold text-foreground">{profile.postsCount}</Text>
                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                  Posts
                </Text>
              </View>
              {'campaignsCount' in profile && (
                <View className="items-center">
                  <Text className="font-bold text-foreground">{profile.campaignsCount}</Text>
                  <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                    Campaigns
                  </Text>
                </View>
              )}
            </View>

            <View className="w-full mt-5 px-4">
              {isSelf ? (
                <GradientButton
                  variant="outline"
                  onPress={async () => {
                    await logout();
                    router.replace('/(auth)/welcome');
                  }}
                >
                  Log Out
                </GradientButton>
              ) : 'isFriend' in profile && profile.isFriend ? (
                <Pressable
                  onPress={() =>
                    showInDevelopmentAlert('Messaging friends isn’t wired up yet.')
                  }
                  className="h-12 rounded-2xl items-center justify-center flex-row gap-2"
                  style={{ backgroundColor: colors.vaykaePink }}
                >
                  <UserCheck size={16} color={colors.background} />
                  <Text className="font-semibold" style={{ color: colors.background }}>
                    Message
                  </Text>
                </Pressable>
              ) : 'requestSent' in profile && profile.requestSent ? (
                <View
                  className="h-12 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: colors.disabledBackground }}
                >
                  <Text className="font-semibold" style={{ color: colors.mutedForeground }}>
                    Friend Request Sent
                  </Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => sendRequest.mutate(profile.id)}
                  disabled={sendRequest.isPending}
                  className="h-12 rounded-2xl items-center justify-center flex-row gap-2"
                  style={{ backgroundColor: colors.vaykaePink }}
                >
                  {sendRequest.isPending ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <>
                      <UserPlus size={16} color={colors.background} />
                      <Text className="font-semibold" style={{ color: colors.background }}>
                        Add Friend
                      </Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          posts.isLoading ? (
            <ActivityIndicator color={colors.vaykaePink} />
          ) : posts.isError ? (
            <View className="items-center px-6">
              <Text style={{ color: colors.mutedForeground }}>Couldn&apos;t load posts.</Text>
            </View>
          ) : (
            <View className="items-center px-6">
              <Text style={{ color: colors.mutedForeground }}>No posts yet.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={currentUserId}
            variant={isSelf ? 'interactive' : 'readonly'}
            onEditPress={(post) =>
              router.push({
                pathname: '/(traveler)/create-post',
                params: {
                  editPostId: post.id,
                  editText: post.text,
                  editLocation: post.location ?? '',
                  editTags: post.tags.join(','),
                  editImageMediaId: post.imageMediaId ?? '',
                  editImageUrl: post.imageUrl ?? '',
                },
              })
            }
            onDeletePress={(post) => deletePost.mutate(post.id)}
          />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (posts.hasNextPage && !posts.isFetchingNextPage) posts.fetchNextPage();
        }}
      />
    </SafeAreaView>
  );
}
