import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Check, CheckCircle2, Circle, X } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import { useFriends } from '../hooks/use-friends-queries';
import { useSharePost } from '../hooks/use-feed-mutations';
import { showInDevelopmentAlert } from '../utils/in-development';
import type { Post } from '../api/types';

interface ShareSheetProps {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
}

export function ShareSheet({ visible, post, onClose }: ShareSheetProps) {
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [shareOnProfile, setShareOnProfile] = useState(false);
  const { data: friends, isLoading } = useFriends();
  const sharePost = useSharePost();

  const reset = () => {
    setSelectedFriendIds([]);
    setShareOnProfile(false);
  };

  const toggleFriend = (id: string) => {
    setSelectedFriendIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const canShare = selectedFriendIds.length > 0 || shareOnProfile;

  const handleShare = () => {
    if (!post || !canShare) return;

    const finish = () => {
      reset();
      onClose();
    };

    if (selectedFriendIds.length > 0) {
      showInDevelopmentAlert(
        'Sharing directly to a friend’s chat isn’t wired up yet.',
        'Not available yet',
        () => (shareOnProfile ? shareToProfile(finish) : finish()),
      );
      return;
    }

    shareToProfile(finish);
  };

  const shareToProfile = (onDone: () => void) => {
    if (!post) return;
    sharePost.mutate({ postId: post.id }, { onSuccess: onDone, onError: onDone });
  };

  const label = () => {
    if (!canShare) return 'Select friends or profile';
    const parts: string[] = [];
    if (selectedFriendIds.length > 0) {
      parts.push(`with ${selectedFriendIds.length} friend${selectedFriendIds.length > 1 ? 's' : ''}`);
    }
    if (shareOnProfile) parts.push('on profile');
    return `Share ${parts.join(' & ')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onClose}>
        <View className="flex-1" />
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-background rounded-t-3xl"
          style={{ maxHeight: '80%' }}
        >
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
          </View>

          <View
            className="flex-row items-center justify-between px-4 py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <Text className="text-lg font-bold text-foreground">Share Post</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            <View className="px-4 pt-4">
              <Text className="text-sm font-medium mb-3" style={{ color: colors.mutedForeground }}>
                Share with Friends
              </Text>
              {isLoading ? (
                <ActivityIndicator color={colors.vaykaePink} />
              ) : !friends || friends.length === 0 ? (
                <Text className="text-sm mb-2" style={{ color: colors.mutedForeground }}>
                  Add friends to share posts with them directly.
                </Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-4">
                    {friends.map((friend) => {
                      const isSelected = selectedFriendIds.includes(friend.id);
                      const name = friend.displayName ?? `@${friend.username}`;
                      return (
                        <Pressable
                          key={friend.id}
                          onPress={() => toggleFriend(friend.id)}
                          className="items-center"
                          style={{ width: 70 }}
                        >
                          <View style={{ position: 'relative' }}>
                            <View
                              style={{
                                borderRadius: 999,
                                borderWidth: isSelected ? 3 : 0,
                                borderColor: colors.vaykaePink,
                                padding: isSelected ? 2 : 0,
                              }}
                            >
                              <Avatar name={name} size={56} />
                            </View>
                            {isSelected && (
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
                                <Check size={14} color={colors.background} />
                              </View>
                            )}
                          </View>
                          <Text
                            numberOfLines={1}
                            className="text-xs font-medium mt-2"
                            style={{ color: isSelected ? colors.vaykaePink : colors.foreground }}
                          >
                            {name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              )}
            </View>

            <View className="px-4 pt-4">
              <Pressable
                onPress={() => setShareOnProfile((prev) => !prev)}
                className="flex-row items-center gap-4 rounded-2xl px-4 py-4"
                style={{
                  borderWidth: 2,
                  borderColor: shareOnProfile ? colors.vaykaePink : colors.border,
                  backgroundColor: shareOnProfile ? `${colors.vaykaePink}1A` : colors.inputBackground,
                }}
              >
                {shareOnProfile ? (
                  <CheckCircle2 size={24} color={colors.vaykaePink} />
                ) : (
                  <Circle size={24} color={colors.mutedForeground} />
                )}
                <View className="flex-1">
                  <Text
                    className="font-bold"
                    style={{ color: shareOnProfile ? colors.vaykaePink : colors.foreground }}
                  >
                    Share on Your Profile
                  </Text>
                  <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                    Post will appear on your timeline
                  </Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>

          <View className="px-4 py-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            <Pressable
              onPress={handleShare}
              disabled={!canShare || sharePost.isPending}
              className="h-12 rounded-full items-center justify-center"
              style={{
                backgroundColor: canShare ? colors.vaykaePink : colors.disabledBackground,
              }}
            >
              {sharePost.isPending ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text
                  className="font-bold"
                  style={{ color: canShare ? colors.background : colors.mutedForeground }}
                >
                  {label()}
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
