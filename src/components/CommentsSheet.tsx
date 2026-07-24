import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Heart, Send, X } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import { formatTimeAgo } from '../utils/format-time-ago';
import { useComments } from '../hooks/use-feed-queries';
import {
  useCreateComment,
  useLikeComment,
  useUnlikeComment,
} from '../hooks/use-feed-mutations';
import type { Comment } from '../api/types';

interface CommentsSheetProps {
  visible: boolean;
  postId: string | null;
  onClose: () => void;
}

function commentAuthorName(author: Comment['author']) {
  return author.displayName ?? `@${author.username}`;
}

export function CommentsSheet({ visible, postId, onClose }: CommentsSheetProps) {
  const [text, setText] = useState('');
  const { data, isLoading, isError, refetch } = useComments(postId ?? '');
  const createComment = useCreateComment();
  const likeComment = useLikeComment();
  const unlikeComment = useUnlikeComment();

  const comments = data?.pages.flatMap((p) => p.items) ?? [];

  const handleSend = () => {
    if (!text.trim() || !postId) return;
    createComment.mutate(
      { postId, text: text.trim() },
      { onSuccess: () => setText('') },
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onClose}>
        <View className="flex-1" />
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-background rounded-t-3xl"
          style={{ maxHeight: '85%' }}
        >
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
          </View>

          <View
            className="flex-row items-center justify-between px-4 py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <Text className="text-lg font-bold text-foreground">Comments</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ maxHeight: 420 }}
          >
            {isLoading ? (
              <View className="py-12 items-center">
                <ActivityIndicator color={colors.vaykaePink} />
              </View>
            ) : isError ? (
              <View className="py-12 items-center px-6">
                <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
                  Couldn&apos;t load comments.
                </Text>
                <Pressable onPress={() => refetch()}>
                  <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                    Try again
                  </Text>
                </Pressable>
              </View>
            ) : comments.length === 0 ? (
              <View className="py-12 items-center">
                <Text style={{ color: colors.mutedForeground }}>No comments yet</Text>
                <Text className="text-sm mt-1" style={{ color: colors.mutedForeground }}>
                  Be the first to comment!
                </Text>
              </View>
            ) : (
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, gap: 16 }}
                renderItem={({ item }) => (
                  <View className="flex-row gap-3">
                    <Avatar name={commentAuthorName(item.author)} size={32} />
                    <View className="flex-1">
                      <View
                        className="rounded-2xl px-4 py-2.5"
                        style={{ backgroundColor: colors.inputBackground }}
                      >
                        <Text className="font-medium text-sm text-foreground mb-1">
                          {commentAuthorName(item.author)}
                        </Text>
                        <Text className="text-sm text-foreground">{item.text}</Text>
                      </View>
                      <View className="flex-row items-center gap-4 mt-1.5 px-2">
                        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                          {formatTimeAgo(item.createdAt)}
                        </Text>
                        <Pressable
                          className="flex-row items-center gap-1"
                          onPress={() => {
                            const payload = { commentId: item.id, postId: item.postId };
                            if (item.isLikedByMe) {
                              unlikeComment.mutate(payload);
                            } else {
                              likeComment.mutate(payload);
                            }
                          }}
                          hitSlop={8}
                        >
                          <Heart
                            size={14}
                            color={item.isLikedByMe ? colors.vaykaePink : colors.mutedForeground}
                            fill={item.isLikedByMe ? colors.vaykaePink : 'transparent'}
                          />
                          <Text
                            className="text-xs"
                            style={{
                              color: item.isLikedByMe ? colors.vaykaePink : colors.mutedForeground,
                            }}
                          >
                            {item.likesCount}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
              />
            )}

            <View
              className="flex-row items-center gap-3 px-4 py-3"
              style={{ borderTopWidth: 1, borderTopColor: colors.border }}
            >
              <Avatar name="You" size={32} />
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Add a comment..."
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 h-10 px-4 rounded-full text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
                onSubmitEditing={handleSend}
              />
              <Pressable
                onPress={handleSend}
                disabled={!text.trim() || createComment.isPending}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: text.trim() ? colors.vaykaePink : colors.disabledBackground,
                }}
              >
                {createComment.isPending ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Send size={18} color={text.trim() ? colors.background : colors.mutedForeground} />
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
