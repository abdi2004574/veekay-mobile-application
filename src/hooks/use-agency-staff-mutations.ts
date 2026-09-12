import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as agencyStaffApi from '../api/agency-staff';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useInviteStaff() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: agencyStaffApi.CreateStaffInviteInput) =>
      agencyStaffApi.inviteStaff(input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', 'staff'] });
      showToast('Staff invited successfully');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateStaffPermission() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ staffId, input }: { staffId: string; input: agencyStaffApi.UpdateStaffPermissionInput }) =>
      agencyStaffApi.updateStaffPermission(staffId, input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', 'staff'] });
      showToast('Permission updated');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useRemoveStaff() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (staffId: string) => agencyStaffApi.removeStaff(staffId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', 'staff'] });
      showToast('Staff member removed');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useResendStaffInvite() {
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (staffId: string) => agencyStaffApi.resendStaffInvite(staffId, requireAccessToken()),
    onSuccess: () => {
      showToast('Invite resent');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
