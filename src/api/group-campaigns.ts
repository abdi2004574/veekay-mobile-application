import { apiFetch } from './client';
import type {
  GroupContribution,
  GroupExpense,
  GroupExpenseCategory,
  GroupMember,
  GroupOverview,
  GroupTrip,
} from './types';

export function getGroupOverview(campaignId: string, accessToken: string) {
  return apiFetch<GroupOverview>(`/campaigns/${campaignId}/group/overview`, { accessToken });
}

export function listGroupMembers(campaignId: string, accessToken: string) {
  return apiFetch<GroupMember[]>(`/campaigns/${campaignId}/group/members`, { accessToken });
}

export function addGroupMember(campaignId: string, userId: string, accessToken: string) {
  return apiFetch<void>(`/campaigns/${campaignId}/group/members`, {
    method: 'POST',
    body: { userId },
    accessToken,
  });
}

export function removeGroupMember(campaignId: string, userId: string, accessToken: string) {
  return apiFetch<void>(`/campaigns/${campaignId}/group/members/${userId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function listGroupContributions(campaignId: string, accessToken: string) {
  return apiFetch<GroupContribution[]>(`/campaigns/${campaignId}/group/contributions`, {
    accessToken,
  });
}

export function addGroupContribution(
  campaignId: string,
  input: { amount: number; note?: string },
  accessToken: string,
) {
  return apiFetch<GroupContribution>(`/campaigns/${campaignId}/group/contributions`, {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function listGroupExpenses(campaignId: string, accessToken: string) {
  return apiFetch<GroupExpense[]>(`/campaigns/${campaignId}/group/expenses`, { accessToken });
}

export interface AddGroupExpenseInput {
  name: string;
  amount: number;
  category: GroupExpenseCategory;
  paidByUserId: string;
  spentAt?: string;
}

export function addGroupExpense(campaignId: string, input: AddGroupExpenseInput, accessToken: string) {
  return apiFetch<GroupExpense>(`/campaigns/${campaignId}/group/expenses`, {
    method: 'POST',
    body: input,
    accessToken,
  });
}

export function removeGroupExpense(campaignId: string, expenseId: string, accessToken: string) {
  return apiFetch<void>(`/campaigns/${campaignId}/group/expenses/${expenseId}`, {
    method: 'DELETE',
    accessToken,
  });
}

export function listMyGroupTrips(accessToken: string) {
  return apiFetch<GroupTrip[]>('/campaigns/group-trips/mine', { accessToken });
}
