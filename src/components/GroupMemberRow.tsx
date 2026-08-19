import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { colors } from '../constants/colors';
import type { GroupMember } from '../api/types';

export function GroupMemberRow({
  member,
  isYou,
  canRemove,
  onRemove,
}: {
  member: GroupMember;
  isYou: boolean;
  canRemove: boolean;
  onRemove?: () => void;
}) {
  const name = member.displayName ?? `@${member.username}`;

  return (
    <View
      className="flex-row items-center gap-3 p-3 rounded-2xl mb-2"
      style={{ backgroundColor: colors.inputBackground }}
    >
      <Avatar name={name} size={48} />
      <View style={{ flex: 1 }}>
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-sm text-foreground">{name}</Text>
          {isYou && (
            <View className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: colors.vaykaePink }}>
              <Text className="text-xs font-bold" style={{ color: colors.background }}>
                You
              </Text>
            </View>
          )}
        </View>
        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
          Contributed: ${member.contributed.toLocaleString()}
        </Text>
      </View>
      <Text className="text-xs mr-1" style={{ color: colors.mutedForeground }}>
        {member.percentage}%
      </Text>
      {canRemove && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <X size={16} color={colors.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
}
