import { Pressable, Text, View } from 'react-native';
import { MoreVertical, Mail, UserX, RotateCcw } from 'lucide-react-native';
import { colors } from '../constants/colors';
import type { StaffPermission, StaffMember } from '../api/agency-staff';

interface StaffMemberRowProps {
  staff: StaffMember;
  isOwner: boolean;
  currentUserId: string;
  onEditPermission?: (staffId: string, permission: StaffPermission) => void;
  onRemove?: (staffId: string) => void;
  onResendInvite?: (staffId: string) => void;
  onViewAudit?: (staffId: string) => void;
}

const PERMISSION_LABELS: Record<StaffPermission, string> = {
  owner: 'Owner',
  admin: 'Admin',
  support: 'Support',
};

const PERMISSION_COLORS: Record<StaffPermission, string> = {
  owner: '#FBBF24',
  admin: '#3b82f6',
  support: '#16a34a',
};

export function StaffMemberRow({
  staff,
  isOwner,
  currentUserId,
  onEditPermission,
  onRemove,
  onResendInvite,
  onViewAudit,
}: StaffMemberRowProps) {
  const isCurrentUser = staff.userId === currentUserId;
  const permission = staff.permission;
  const permissionColor = PERMISSION_COLORS[permission];

  return (
    <View className='p-4 bg-card border border-border rounded-2xl'>
      <View className='flex-row items-center justify-between mb-3'>
        <View className='flex-row items-center gap-3'>
          <View className='w-10 h-10 rounded-full bg-muted items-center justify-center'>
            <Text className='text-lg font-bold' style={{ color: colors.foreground }}>
              {staff.user.displayName?.[0]?.toUpperCase() || staff.user.username?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
          <View>
            <Text className='font-bold text-foreground'>{staff.user.displayName || staff.user.username}</Text>
            <Text className='text-xs' style={{ color: colors.mutedForeground }}>{staff.user.email}</Text>
          </View>
        </View>
        <View className='flex-row items-center gap-2'>
          <View
            className='px-3 py-1 rounded-full items-center'
            style={{ backgroundColor: permissionColor + '20' }}
          >
            <Text className='text-xs font-bold' style={{ color: permissionColor }}>
              {PERMISSION_LABELS[permission]}
            </Text>
          </View>
          {(isOwner && !isCurrentUser) && (
            <Pressable
              onPress={() => onViewAudit?.(staff.id)}
              hitSlop={8}
              className='p-2 rounded-lg'
              style={{ backgroundColor: colors.muted }}
            >
              <MoreVertical size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
      </View>

      {(isOwner && !isCurrentUser) && onEditPermission && (
        <View className='pt-3 border-t' style={{ borderColor: colors.border }}>
          <Text className='text-xs font-bold mb-2' style={{ color: colors.mutedForeground }}>Actions</Text>
          <View className='flex-row gap-2'>
            <Pressable
              onPress={() => onEditPermission(staff.id, permission === 'admin' ? 'support' : 'admin')}
              className='flex-1 py-2 px-3 rounded-lg items-center border'
              style={{ borderColor: colors.border }}
            >
              <RotateCcw size={16} color={colors.foreground} />
              <Text className='text-xs font-bold ml-1 text-foreground'>Change Role</Text>
            </Pressable>
            <Pressable
              onPress={() => onResendInvite?.(staff.id)}
              className='flex-1 py-2 px-3 rounded-lg items-center border'
              style={{ borderColor: colors.border }}
            >
              <Mail size={16} color={colors.foreground} />
              <Text className='text-xs font-bold ml-1 text-foreground'>Resend Invite</Text>
            </Pressable>
            <Pressable
              onPress={() => onRemove?.(staff.id)}
              className='flex-1 py-2 px-3 rounded-lg items-center border'
              style={{ borderColor: colors.destructive }}
            >
              <UserX size={16} color={colors.destructive} />
              <Text className='text-xs font-bold ml-1' style={{ color: colors.destructive }}>Remove</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
