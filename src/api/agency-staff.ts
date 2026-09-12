import { apiFetch } from './client';

export type StaffPermission = 'owner' | 'admin' | 'support';

export interface StaffMember {
  id: string;
  agencyId: string;
  userId: string;
  permission: StaffPermission;
  createdAt: string;
  user: {
    id: string;
    email: string;
    displayName: string | null;
    username: string;
  };
}

export interface StaffListResponse {
  staff: StaffMember[];
}

export interface CreateStaffInviteInput {
  email: string;
  permission?: 'admin' | 'support';
}

export interface UpdateStaffPermissionInput {
  permission: StaffPermission;
}

export interface StaffAuditLogEntry {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface StaffAuditLogResponse {
  items: StaffAuditLogEntry[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function listStaff(accessToken: string) {
  return apiFetch<StaffListResponse>('/agency/staff', { accessToken });
}

export function inviteStaff(input: CreateStaffInviteInput, accessToken: string) {
  return apiFetch<StaffMember>('/agency/staff', {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function updateStaffPermission(staffId: string, input: UpdateStaffPermissionInput, accessToken: string) {
  return apiFetch<StaffMember>('/agency/staff/' + staffId + '/permission', {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function removeStaff(staffId: string, accessToken: string) {
  return apiFetch<void>('/agency/staff/' + staffId, {
    method: 'DELETE',
    accessToken,
  });
}

export function resendStaffInvite(staffId: string, accessToken: string) {
  return apiFetch<void>('/agency/staff/' + staffId + '/resend-invite', {
    method: 'POST',
    accessToken,
  });
}

export function getStaffAuditLog(accessToken: string, staffId: string, cursor?: string, limit?: number) {
  const params: Record<string, string | number | undefined> = {};
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => k + '=' + encodeURIComponent(String(v)))
    .join('&');
  const path = query ? '/agency/staff/' + staffId + '/audit?' + query : '/agency/staff/' + staffId + '/audit';
  return apiFetch<StaffAuditLogResponse>(path, { accessToken });
}
