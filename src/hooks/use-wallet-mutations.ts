import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as walletApi from "../api/wallet";
import { requireAccessToken } from "../utils/require-access-token";
import { generateIdempotencyKey } from "../utils/idempotency-key";
import { useToastStore } from "../stores/toast-store";
import { friendlyErrorMessage } from "../utils/error-message";
import { purchaseDonation, DonationPurchaseResult } from "../services/revenue-cat";

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation<
    walletApi.WithdrawalRequest,
    Error,
    walletApi.CreateWithdrawalInput
  >({
    mutationFn: async (input: walletApi.CreateWithdrawalInput) => {
      const idempotencyKey = await generateIdempotencyKey();
      return walletApi.createWithdrawal(
        input,
        requireAccessToken(),
        idempotencyKey,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      showToast("Withdrawal request submitted.");
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDonate() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation<
    DonationPurchaseResult,
    Error,
    { campaignId: string; productId: string }
  >({
    mutationFn: async (variables) => {
      return purchaseDonation(variables.productId, variables.campaignId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaign", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", "mine"] });
      showToast("Donation successful!");
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
