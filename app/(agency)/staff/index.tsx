import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserPlus, X, AlertCircle } from 'lucide-react-native';
import { StaffMemberRow } from '../../../src/components/StaffMemberRow';
import { AgencyBottomNav } from '../../../src/components/AgencyBottomNav';
import { BOTTOM_NAV_HEIGHT } from '../../../src/components/BottomNavBar';
import { colors } from '../../../src/constants/colors';
import { useStaffList } from '../../../src/hooks/use-agency-staff-queries';
import { useInviteStaff, useUpdateStaffPermission, useRemoveStaff, useResendStaffInvite } from '../../../src/hooks/use-agency-staff-mutations';
import { useAuthStore } from '../../../src/stores/auth-store';
import { showInDevelopmentAlert } from '../../../src/utils/in-development';
import type { StaffPermission } from '../../../src/api/agency-staff';

const PERMISSION_OPTIONS: { value: Exclude<StaffPermission, 'owner'>; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'support', label: 'Support' },
];

export default function StaffScreen() {
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState<Exclude<StaffPermission, 'owner'>>('support');
  const [removeConfirmStaffId, setRemoveConfirmStaffId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const currentUserId = user?.id ?? '';

  const staffQuery = useStaffList();
  const inviteMutation = useInviteStaff();
  const updatePermissionMutation = useUpdateStaffPermission();
  const removeMutation = useRemoveStaff();
  const resendInviteMutation = useResendStaffInvite();

  const staff = staffQuery.data?.staff ?? [];
  const isOwner = staff.some((s) => s.userId === currentUserId && s.permission === 'owner');

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    inviteMutation.mutate({ email: inviteEmail.trim(), permission: invitePermission });
    setInviteEmail('');
    setInvitePermission('support');
    setInviteModalVisible(false);
  };

  const handleChangePermission = (staffId: string, permission: StaffPermission) => {
    updatePermissionMutation.mutate({ staffId, input: { permission } });
  };

  const handleRemove = (staffId: string) => {
    setRemoveConfirmStaffId(staffId);
  };

  const handleRemoveConfirm = () => {
    if (removeConfirmStaffId) {
      removeMutation.mutate(removeConfirmStaffId);
      setRemoveConfirmStaffId(null);
    }
  };

  const handleResendInvite = (staffId: string) => {
    resendInviteMutation.mutate(staffId);
  };

  const handleViewAudit = (staffId: string) => {
    showInDevelopmentAlert('Staff audit log is not built yet.');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View style={{ flex: 1 }}>
        <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Staff Management</Text>
          <Pressable
            onPress={() => setInviteModalVisible(true)}
            className="flex-row items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: colors.vaykaePink }}
          >
            <UserPlus size={18} color={colors.background} />
            <Text className="font-semibold" style={{ color: colors.background }}>Invite Staff</Text>
          </Pressable>
        </View>

        {staffQuery.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.vaykaePink} />
          </View>
        ) : staffQuery.isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center mb-3" style={{ color: colors.mutedForeground }}>
              Couldn&apos;t load staff members.
            </Text>
            <Pressable onPress={() => staffQuery.refetch()}>
              <Text style={{ color: colors.vaykaePink }} className="font-semibold">
                Try again
              </Text>
            </Pressable>
          </View>
        ) : staff.length === 0 ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 80 }}>
            <View className="flex-1 items-center justify-center py-16">
              <Text className="text-center mt-3 mb-1 text-foreground font-medium">No staff members yet</Text>
              <Text className="text-sm text-center" style={{ color: colors.mutedForeground }}>
                Tap &ldquo;Invite Staff&rdquo; to add team members
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: BOTTOM_NAV_HEIGHT + insets.bottom + 88, gap: 12 }}>
            {staff.map((member) => (
              <StaffMemberRow
                key={member.id}
                staff={member}
                isOwner={isOwner}
                currentUserId={currentUserId}
                onEditPermission={handleChangePermission}
                onRemove={handleRemove}
                onResendInvite={handleResendInvite}
                onViewAudit={handleViewAudit}
              />
            ))}
          </ScrollView>
        )}

        <AgencyBottomNav active="profile" />

        <InviteStaffModal
          visible={inviteModalVisible}
          onClose={() => setInviteModalVisible(false)}
          onSubmit={handleInvite}
          email={inviteEmail}
          setEmail={setInviteEmail}
          permission={invitePermission}
          setPermission={setInvitePermission}
          isLoading={inviteMutation.isPending}
        />

        {removeConfirmStaffId && (
          <RemoveConfirmModal
            visible={true}
            onClose={() => setRemoveConfirmStaffId(null)}
            onConfirm={handleRemoveConfirm}
            isLoading={removeMutation.isPending}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function InviteStaffModal({
  visible,
  onClose,
  onSubmit,
  email,
  setEmail,
  permission,
  setPermission,
  isLoading,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  email: string;
  setEmail: (v: string) => void;
  permission: Exclude<StaffPermission, 'owner'>;
  setPermission: (v: Exclude<StaffPermission, 'owner'>) => void;
  isLoading: boolean;
}) {
  const handleClose = () => {
    setEmail('');
    setPermission('support');
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
            <Text className="text-lg font-bold text-foreground">Invite Staff Member</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="staff@example.com"
                placeholderTextColor={colors.mutedForeground}
                className="h-12 rounded-2xl px-4 text-foreground"
                style={{ backgroundColor: colors.inputBackground }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">Permission Level</Text>
              <View className="flex-row gap-3">
                {PERMISSION_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    onPress={() => setPermission(opt.value)}
                    className="flex-1 py-3 px-4 rounded-xl items-center border-2"
                    style={{
                      borderColor: permission === opt.value ? colors.vaykaePink : colors.border,
                      backgroundColor: permission === opt.value ? colors.vaykaePink + '15' : colors.inputBackground,
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{ color: permission === opt.value ? colors.vaykaePink : colors.foreground }}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3 pt-4">
              <Pressable
                onPress={handleClose}
                className="flex-1 py-3 px-4 rounded-xl items-center border"
                style={{ borderColor: colors.border }}
              >
                <Text className="font-semibold text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onSubmit}
                disabled={!email.trim() || isLoading}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={{ backgroundColor: colors.vaykaePink }}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} size="small" />
                ) : (
                  <Text className="font-semibold" style={{ color: colors.background }}>
                    Send Invite
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function RemoveConfirmModal({
  visible,
  onClose,
  onConfirm,
  isLoading,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={onClose}>
        <View className="flex-1" />
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-background rounded-3xl mx-4"
          style={{ maxHeight: '80%' }}
        >
          <View className="p-6 items-center">
            <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: colors.destructive + '15' }}>
              <AlertCircle size={28} color={colors.destructive} />
            </View>
            <Text className="text-xl font-bold text-foreground text-center mb-2">Remove Staff Member?</Text>
            <Text className="text-sm text-center mb-6" style={{ color: colors.mutedForeground }}>
              This action cannot be undone. The staff member will lose access to the agency dashboard.
            </Text>
            <View className="flex-row gap-3 w-full">
              <Pressable
                onPress={onClose}
                className="flex-1 py-3 px-4 rounded-xl items-center border"
                style={{ borderColor: colors.border }}
              >
                <Text className="font-semibold text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl items-center"
                style={{ backgroundColor: colors.destructive }}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} size="small" />
                ) : (
                  <Text className="font-semibold" style={{ color: colors.background }}>
                    Remove
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
