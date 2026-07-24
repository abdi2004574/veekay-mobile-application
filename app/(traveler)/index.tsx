import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Plus, Users } from 'lucide-react-native';
import { PostCard } from '../../src/components/PostCard';
import { CommentsSheet } from '../../src/components/CommentsSheet';
import { ShareSheet } from '../../src/components/ShareSheet';
import { StoryRing } from '../../src/components/StoryRing';
import { Avatar } from '../../src/components/Avatar';
import { colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/auth-store';
import { useFeed, useActiveStories } from '../../src/hooks/use-feed-queries';
import { useLikePost, useUnlikePost, useDeletePost } from '../../src/hooks/use-feed-mutations';
import { showInDevelopmentAlert } from '../../src/utils/in-development';
import type { Post } from '../../src/api/types';

export default function FeedScreen() {
  const user = useAuthStore((s) => s.user);
  const currentUserId = user?.id ?? '';

  const feed = useFeed();
  const stories = useActiveStories();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const deletePost = useDeletePost();

  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);

  const posts = useMemo(() => feed.data?.pages.flatMap((p) => p.items) ?? [], [feed.data]);

  const storyAuthors = useMemo(() => {
    const byAuthor = new Map<string, { name: string; storyIds: string[] }>();
    for (const story of stories.data ?? []) {
      const name = story.author.displayName ?? `@${story.author.username}`;
      const entry = byAuthor.get(story.authorId);
      if (entry) {
        entry.storyIds.push(story.id);
      } else {
        byAuthor.set(story.authorId, { name, storyIds: [story.id] });
      }
    }
    return Array.from(byAuthor.entries()).map(([authorId, v]) => ({ authorId, ...v }));
  }, [stories.data]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-xl font-bold text-foreground">Veakay</Text>
          <View className="flex-row items-center gap-4">
            <Pressable
              hitSlop={8}
              onPress={() => router.push('/(traveler)/friends')}
            >
              <Users size={22} color={colors.foreground} />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() =>
                showInDevelopmentAlert('Notifications aren’t available yet.')
              }
            >
              <Bell size={22} color={colors.foreground} />
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => router.push(`/(traveler)/user/${currentUserId}`)}
            >
              <Avatar name={user?.displayName ?? 'You'} size={32} />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListHeaderComponent={
            <FlatList
              data={[{ authorId: 'self', name: 'Your Story', storyIds: [] }, ...storyAuthors]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.authorId}
              contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
              renderItem={({ item }) =>
                item.authorId === 'self' ? (
                  <Pressable
                    onPress={() => router.push('/(traveler)/create-story')}
                    className="items-center"
                    style={{ width: 72 }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        borderWidth: 2,
                        borderColor: colors.border,
                        borderStyle: 'dashed',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={24} color={colors.mutedForeground} />
                    </View>
                    <Text className="text-xs font-medium mt-1.5 text-foreground" numberOfLines={1}>
                      Your Story
                    </Text>
                  </Pressable>
                ) : (
                  <StoryRing
                    name={item.name}
                    onPress={() =>
                      router.push({
                        pathname: '/(traveler)/story/[id]',
                        params: { id: item.storyIds[0], ids: item.storyIds.join(',') },
                      })
                    }
                  />
                )
              }
            />
          }
          ListEmptyComponent={
            feed.isLoading ? (
              <View className="py-16 items-center">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : feed.isError ? (
              <View className="py-16 items-center px-6">
                <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
                  Couldn&apos;t load your feed.
                </Text>
                <Pressable onPress={() => feed.refetch()}>
                  <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                    Try again
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="py-16 items-center px-6">
                <Text className="text-center font-semibold text-foreground mb-1">
                  Your feed is quiet
                </Text>
                <Text className="text-center" style={{ color: colors.mutedForeground }}>
                  Add friends and share your first post to get started.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              currentUserId={currentUserId}
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
                  },
                })
              }
              onDeletePress={(post) => deletePost.mutate(post.id)}
            />
          )}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (feed.hasNextPage && !feed.isFetchingNextPage) {
              feed.fetchNextPage();
            }
          }}
          ListFooterComponent={
            feed.isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : null
          }
        />

        <Pressable
          onPress={() => router.push('/(traveler)/create-post')}
          style={{
            position: 'absolute',
            right: 20,
            bottom: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.vaykaePink,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Plus size={26} color={colors.background} />
        </Pressable>
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
