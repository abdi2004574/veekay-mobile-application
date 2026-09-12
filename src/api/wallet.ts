import { apiFetch } from './client';
import type {
  CreateWithdrawalInput,
  DonateManualInput,
  DonateManualResponse,
  WalletAccount,
  WalletTransactionsPage,
  WithdrawalRequest,
  WithdrawalsPage,
} from './types';
export type { CreateWithdrawalInput, DonateManualInput, WithdrawalRequest, DonateManualResponse } from './types';

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => k + '=' + encodeURIComponent(String(v)))
    .join('&');
  return query ? path + '?' + query : path;
}

export function getMyWallet(accessToken: string) {
  return apiFetch<WalletAccount>('/me/wallet', { accessToken });
}

export function listTransactions(
  accessToken: string,
  filter: { type?: string; cursor?: string; limit?: number } = {},
) {
  return apiFetch<WalletTransactionsPage>(
    withQuery('/me/wallet/transactions', { type: filter?.type, cursor: filter?.cursor, limit: filter?.limit }),
    { accessToken },
  );
}

export function listMyWithdrawals(
  accessToken: string,
  cursor?: string,
  limit = 20,
) {
  return apiFetch<WithdrawalsPage>(
    withQuery('/me/wallet/withdrawals', { cursor, limit }),
    { accessToken },
  );
}

export function createWithdrawal(
  input: CreateWithdrawalInput,
  accessToken: string,
  idempotencyKey: string,
) {
  return apiFetch<WithdrawalRequest>('/me/wallet/withdrawals', {
    method: 'POST',
    body: input,
    accessToken,
    idempotencyKey,
  });
}

export function getWithdrawalDetail(id: string, accessToken: string) {
  return apiFetch<WithdrawalRequest>('/me/wallet/withdrawals/' + id, { accessToken });
}

export function donateManual(
  campaignId: string,
  input: DonateManualInput,
  accessToken: string,
  idempotencyKey: string,
) {
  return apiFetch<DonateManualResponse>('/campaigns/' + campaignId + '/donate-manual', {
    method: 'POST',
    body: input,
    accessToken,
    idempotencyKey,
  });
}