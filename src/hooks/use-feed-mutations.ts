import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as feedApi from '../api/feed';
import { requireAccessToken } from '../utils/require-access-token';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

export function useCreatePost() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: feedApi.CreatePostInput) => feedApi.createPost(input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ postId, input }: { postId: string; input: Partial<feedApi.CreatePostInput> }) =>
      feedApi.updatePost(postId, input, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (postId: string) => feedApi.deletePost(postId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      showToast('Post deleted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (postId: string) => feedApi.likePost(postId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (postId: string) => feedApi.unlikePost(postId, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useSharePost() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ postId, caption }: { postId: string; caption?: string }) =>
      feedApi.sharePost(postId, caption, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      showToast('Shared to your profile.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ postId, text }: { postId: string; text: string }) =>
      feedApi.createComment(postId, text, requireAccessToken()),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      feedApi.updateComment(commentId, text, requireAccessToken()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      feedApi.deleteComment(commentId, requireAccessToken()),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      feedApi.likeComment(commentId, requireAccessToken()),
    onSuccess: (_, { postId }) =>
      queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnlikeComment() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      feedApi.unlikeComment(commentId, requireAccessToken()),
    onSuccess: (_, { postId }) =>
      queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: feedApi.CreateStoryInput) => feedApi.createStory(input, requireAccessToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      showToast('Story posted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useViewStory() {
  return useMutation({
    mutationFn: (storyId: string) => feedApi.viewStory(storyId, requireAccessToken()),
  });
}

export function useLikeStory() {
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (storyId: string) => feedApi.likeStory(storyId, requireAccessToken()),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
