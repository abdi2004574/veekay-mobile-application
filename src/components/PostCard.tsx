import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  Heart,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  MoreVertical,
  Repeat2,
  Share2,
} from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import { formatTimeAgo } from '../utils/format-time-ago';
import { showAlert } from '../utils/show-alert';
import type { Post } from '../api/types';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  // Set to the profile screen's own :id param when rendering inside a
  // profile's post list — tapping a post authored by that same id is then a
  // no-op instead of pushing a duplicate copy of the screen you're already on.
  viewingProfileId?: string;
  onLikeToggle?: (post: Post) => void;
  onCommentPress?: (post: Post) => void;
  onSharePress?: (post: Post) => void;
  onEditPress?: (post: Post) => void;
  onDeletePress?: (post: Post) => void;
}

function authorName(author: Post['author']) {
  return author.displayName ?? `@${author.username}`;
}

export function PostCard({
  post,
  currentUserId,
  viewingProfileId,
  onLikeToggle,
  onCommentPress,
  onSharePress,
  onEditPress,
  onDeletePress,
}: PostCardProps) {
  const isOwn = post.authorId === currentUserId;
  const isAlreadyViewingAuthor = post.authorId === viewingProfileId;

  const openOptions = () => {
    showAlert('Post', undefined, [
      { text: 'Edit Post', onPress: () => onEditPress?.(post) },
      {
        text: 'Delete Post',
        style: 'destructive',
        onPress: () =>
          showAlert('Delete post?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDeletePress?.(post) },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View
      className="bg-background rounded-2xl mb-4 px-4 py-4"
      style={{ borderWidth: 1, borderColor: colors.border }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Pressable
          className="flex-row items-center gap-3 flex-1"
          onPress={
            isAlreadyViewingAuthor
              ? undefined
              : () => router.push(`/(traveler)/user/${post.authorId}`)
          }
        >
          <Avatar name={authorName(post.author)} size={40} />
          <View>
            <Text className="font-semibold text-foreground">{authorName(post.author)}</Text>
            <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </Pressable>
        {isOwn && (
          <Pressable onPress={openOptions} hitSlop={8}>
            <MoreVertical size={20} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {post.repostOf && (
        <View
          className="rounded-xl px-3 py-2 mb-3 flex-row items-center gap-2"
          style={{ backgroundColor: colors.inputBackground }}
        >
          <Repeat2 size={16} color={colors.mutedForeground} />
          <Text className="text-xs flex-1" style={{ color: colors.mutedForeground }} numberOfLines={2}>
            Reposted from {authorName(post.repostOf.author)}: {post.repostOf.text}
          </Text>
        </View>
      )}

      {!!post.text && <Text className="text-foreground mb-2">{post.text}</Text>}

      {post.location && (
        <View className="flex-row items-center gap-1 mb-2">
          <MapPin size={14} color={colors.mutedForeground} />
          <Text className="text-xs" style={{ color: colors.mutedForeground }}>
            {post.location}
          </Text>
        </View>
      )}

      {post.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <View
              key={tag}
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: colors.inputBackground }}
            >
              <Text className="text-xs font-medium text-foreground">#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {post.imageMediaId && (
        post.imageUrl ? (
          <Image
            source={{ uri: post.imageUrl }}
            style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 8 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="rounded-xl items-center justify-center mb-2"
            style={{ height: 160, backgroundColor: colors.inputBackground }}
          >
            <ImageIcon size={28} color={colors.mutedForeground} />
            <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
              Photo unavailable
            </Text>
          </View>
        )
      )}

      <View className="flex-row items-center gap-6 pt-2" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        <Pressable
          className="flex-row items-center gap-1.5"
          onPress={() => onLikeToggle?.(post)}
          hitSlop={8}
        >
          <Heart
            size={18}
            color={post.isLikedByMe ? colors.vaykaePink : colors.mutedForeground}
            fill={post.isLikedByMe ? colors.vaykaePink : 'transparent'}
          />
          <Text
            className="text-sm"
            style={{ color: post.isLikedByMe ? colors.vaykaePink : colors.mutedForeground }}
          >
            {post.likesCount}
          </Text>
        </Pressable>
        <Pressable
          className="flex-row items-center gap-1.5"
          onPress={() => onCommentPress?.(post)}
          hitSlop={8}
        >
          <MessageCircle size={18} color={colors.mutedForeground} />
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            {post.commentsCount}
          </Text>
        </Pressable>
        <Pressable
          className="flex-row items-center gap-1.5"
          onPress={() => onSharePress?.(post)}
          hitSlop={8}
        >
          <Share2 size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>
    </View>
  );
}
