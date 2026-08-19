import { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Plus, Search, X } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import { useFriends } from '../hooks/use-friends-queries';
import { useAddGroupMember } from '../hooks/use-group-campaigns-mutations';
import type { GroupMember } from '../api/types';

interface AddGroupMemberSheetProps {
  visible: boolean;
  campaignId: string;
  members: GroupMember[];
  onClose: () => void;
}

export function AddGroupMemberSheet({ visible, campaignId, members, onClose }: AddGroupMemberSheetProps) {
  const [query, setQuery] = useState('');
  const { data: friends, isLoading } = useFriends();
  const addMember = useAddGroupMember(campaignId);

  const memberIds = useMemo(() => new Set(members.map((m) => m.userId)), [members]);
  const candidates = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return (friends ?? [])
      .filter((f) => !memberIds.has(f.id))
      .filter((f) => {
        if (!trimmed) return true;
        const name = (f.displayName ?? f.username).toLowerCase();
        return name.includes(trimmed) || f.username.toLowerCase().includes(trimmed);
      });
  }, [friends, memberIds, query]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={handleClose}>
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
            <Text className="text-lg font-bold text-foreground">Add Member</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <View className="px-4 pt-4 pb-2">
            <View className="relative justify-center">
              <View className="absolute left-4 z-10">
                <Search size={18} color={colors.mutedForeground} />
              </View>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search friends..."
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl pl-12 pr-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
              />
            </View>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
            {isLoading ? (
              <ActivityIndicator color={colors.vaykaePink} />
            ) : candidates.length === 0 ? (
              <Text className="text-center py-8" style={{ color: colors.mutedForeground }}>
                {friends?.length ? 'No friends match your search.' : 'Add friends to invite them to trips.'}
              </Text>
            ) : (
              candidates.map((friend) => {
                const name = friend.displayName ?? `@${friend.username}`;
                const isAdding = addMember.isPending && addMember.variables === friend.id;
                return (
                  <View key={friend.id} className="flex-row items-center gap-3 py-2">
                    <Avatar name={name} size={44} />
                    <View style={{ flex: 1 }}>
                      <Text className="font-semibold text-foreground">{name}</Text>
                      <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                        @{friend.username}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => addMember.mutate(friend.id)}
                      disabled={isAdding}
                      className="w-9 h-9 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.vaykaePink }}
                    >
                      {isAdding ? (
                        <ActivityIndicator size="small" color={colors.background} />
                      ) : (
                        <Plus size={18} color={colors.background} />
                      )}
                    </Pressable>
                  </View>
                );
              })
            )}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
