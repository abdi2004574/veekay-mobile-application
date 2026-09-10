import { useQuery } from '@tanstack/react-query';
import * as walletApi from '../api/wallet';
import { useAuthStore } from '../stores/auth-store';

export function useMyWallet() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['wallet', 'account'],
    queryFn: () => walletApi.getMyWallet(accessToken!),
    enabled: !!accessToken,
  });
}

export function useWalletTransactions(options?: { type?: string; cursor?: string; limit?: number }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['wallet', 'transactions', options],
    queryFn: () => walletApi.listTransactions(accessToken!, options),
    enabled: !!accessToken,
  });
}

export function useMyWithdrawals(cursor?: string, limit = 20) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['wallet', 'withdrawals', cursor, limit],
    queryFn: () => walletApi.listMyWithdrawals(accessToken!, cursor, limit),
    enabled: !!accessToken,
  });
}

export function useWithdrawalDetail(id: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['wallet', 'withdrawal', id],
    queryFn: () => walletApi.getWithdrawalDetail(id, accessToken!),
    enabled: !!accessToken && !!id,
  });
}