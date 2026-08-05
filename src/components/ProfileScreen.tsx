import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  Settings as SettingsIcon,
  Star,
  UserCheck,
  UserPlus,
} from 'lucide-react-native';
import { Avatar } from './Avatar';
import { PostCard } from './PostCard';
import { CommentsSheet } from './CommentsSheet';
import { ShareSheet } from './ShareSheet';
import { TravelerBottomNav } from './TravelerBottomNav';
import { colors } from '../constants/colors';
import { useAuthStore } from '../stores/auth-store';
import { useMe, useUserProfile } from '../hooks/use-users-queries';
import { useUserPosts } from '../hooks/use-feed-queries';
import { useLikePost, useUnlikePost, useDeletePost } from '../hooks/use-feed-mutations';
import { useSendFriendRequest } from '../hooks/use-friend-mutations';
import { useCreateConversation } from '../hooks/use-chat-mutations';
import type { Post } from '../api/types';

// Shared by two routes: app/(traveler)/profile/index.tsx (the bottom-nav tab,
// always your own profile, no transition animation — see that route's layout
// entry) and app/(traveler)/user/[id].tsx (drill-down to any profile from a
// post/friend tap, keeps the default slide since it's a real hierarchy push).
export function ProfileScreen({
  userId,
  showBackButton = true,
}: {
  userId: string;
  // The tab route reaches this screen via router.replace(), which leaves no
  // history to go back to — router.back() there would error. Only the
  // drill-down route (a genuine push, with real history) should show this.
  showBackButton?: boolean;
}) {
  const currentUserId = useAuthStore((s) => s.user?.id) ?? '';
  const isSelf = userId === currentUserId;

  const me = useMe();
  const otherProfile = useUserProfile(isSelf ? '' : userId);
  const posts = useUserPosts(userId);
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const deletePost = useDeletePost();
  const sendRequest = useSendFriendRequest();
  const createConversation = useCreateConversation();

  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);

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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View
        className="flex-row items-center px-4 h-14"
        style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
      >
        {showBackButton && (
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={20} color={colors.foreground} />
          </Pressable>
        )}
        <Text
          className={`text-lg font-bold text-foreground ${showBackButton ? 'ml-3' : ''}`}
        >
          @{profile.username}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: isSelf ? 96 : 48 }}
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
                  <Pressable
                    className="items-center"
                    onPress={() =>
                      isSelf
                        ? router.push('/(traveler)/campaigns')
                        : router.push({
                            pathname: '/(traveler)/user-campaigns/[userId]',
                            params: { userId, creatorName: name },
                          })
                    }
                  >
                    <Text className="font-bold text-foreground">{profile.campaignsCount}</Text>
                    <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                      Campaigns
                    </Text>
                  </Pressable>
                )}
              </View>

              <View className="w-full mt-5 px-4">
                {isSelf ? (
                  <>
                    <Pressable
                      onPress={() => router.push('/(traveler)/my-reviews')}
                      className="flex-row items-center gap-3 p-4 rounded-2xl mb-3"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    >
                      <View
                        className="items-center justify-center rounded-xl"
                        style={{ width: 40, height: 40, backgroundColor: colors.vaykaePink }}
                      >
                        <Star size={18} color={colors.background} />
                      </View>
                      <Text className="font-bold text-foreground flex-1">My Reviews</Text>
                      <ChevronRight size={18} color={colors.mutedForeground} />
                    </Pressable>
                    <Pressable
                      onPress={() => router.push('/(traveler)/settings')}
                      className="flex-row items-center gap-3 p-4 rounded-2xl"
                      style={{ borderWidth: 1, borderColor: colors.border }}
                    >
                      <View
                        className="items-center justify-center rounded-xl"
                        style={{ width: 40, height: 40, backgroundColor: colors.vaykaePink }}
                      >
                        <SettingsIcon size={18} color={colors.background} />
                      </View>
                      <Text className="font-bold text-foreground flex-1">Settings</Text>
                      <ChevronRight size={18} color={colors.mutedForeground} />
                    </Pressable>
                  </>
                ) : 'isFriend' in profile && profile.isFriend ? (
                  <Pressable
                    onPress={() =>
                      createConversation.mutate(
                        { type: 'direct', participantId: profile.id },
                        {
                          onSuccess: (conversation) =>
                            router.push(`/(traveler)/chat/${conversation.id}`),
                        },
                      )
                    }
                    disabled={createConversation.isPending}
                    className="h-12 rounded-2xl items-center justify-center flex-row gap-2"
                    style={{ backgroundColor: colors.vaykaePink }}
                  >
                    {createConversation.isPending ? (
                      <ActivityIndicator color={colors.background} />
                    ) : (
                      <>
                        <UserCheck size={16} color={colors.background} />
                        <Text className="font-semibold" style={{ color: colors.background }}>
                          Message
                        </Text>
                      </>
                    )}
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
              viewingProfileId={userId}
              onLikeToggle={(post) =>
                post.isLikedByMe ? unlikePost.mutate(post.id) : likePost.mutate(post.id)
              }
              onCommentPress={(post) => setCommentsPostId(post.id)}
              onSharePress={(post) => setSharePost(post)}
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
        {isSelf && <TravelerBottomNav active="profile" />}
      </View>

      <CommentsSheet
        visible={!!commentsPostId}
        postId={commentsPostId}
        onClose={() => setCommentsPostId(null)}
      />
      <ShareSheet visible={!!sharePost} post={sharePost} onClose={() => setSharePost(null)} />
    </SafeAreaView>
  );
}
