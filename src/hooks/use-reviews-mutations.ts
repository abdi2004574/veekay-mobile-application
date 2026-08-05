import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../api/reviews';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useCreateReview(agencyId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: reviewsApi.ReviewInput) =>
      reviewsApi.createReview(agencyId, input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['agency-reviews', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateReview(agencyId: string) {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ reviewId, input }: { reviewId: string; input: Partial<reviewsApi.ReviewInput> }) =>
      reviewsApi.updateReview(reviewId, input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['agency-reviews', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency'] });
      queryClient.invalidateQueries({ queryKey: ['agency-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] });
      showToast('Review deleted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
