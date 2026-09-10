import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as walletApi from '../api/wallet';
import { requireAccessToken } from '../utils/require-access-token';
import { generateIdempotencyKey } from '../utils/idempotency-key';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: async (input: walletApi.CreateWithdrawalInput) => {
      const idempotencyKey = await generateIdempotencyKey();
      return walletApi.createWithdrawal(input, requireAccessToken(), idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      showToast('Withdrawal request submitted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}