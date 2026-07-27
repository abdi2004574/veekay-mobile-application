import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../api/reviews';
import { useAuthStore } from '../stores/auth-store';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

function useToken() {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) throw new Error('Not authenticated');
  return accessToken;
}

export function useCreateReview(agencyId: string) {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: reviewsApi.ReviewInput) =>
      reviewsApi.createReview(agencyId, input, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['agency-reviews', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateReview(agencyId: string) {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ reviewId, input }: { reviewId: string; input: Partial<reviewsApi.ReviewInput> }) =>
      reviewsApi.updateReview(reviewId, input, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['agency-reviews', agencyId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeleteReview() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency'] });
      queryClient.invalidateQueries({ queryKey: ['agency-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'mine'] });
      showToast('Review deleted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
