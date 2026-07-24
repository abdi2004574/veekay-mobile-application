import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as feedApi from '../api/feed';
import { useAuthStore } from '../stores/auth-store';
import { useToastStore } from '../stores/toast-store';
import { friendlyErrorMessage } from '../utils/error-message';

function useToken() {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) throw new Error('Not authenticated');
  return accessToken;
}

export function useCreatePost() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: feedApi.CreatePostInput) => feedApi.createPost(input, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdatePost() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ postId, input }: { postId: string; input: Partial<feedApi.CreatePostInput> }) =>
      feedApi.updatePost(postId, input, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeletePost() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (postId: string) => feedApi.deletePost(postId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      showToast('Post deleted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useLikePost() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (postId: string) => feedApi.likePost(postId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnlikePost() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (postId: string) => feedApi.unlikePost(postId, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useSharePost() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ postId, caption }: { postId: string; caption?: string }) =>
      feedApi.sharePost(postId, caption, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      showToast('Shared to your profile.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useCreateComment() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ postId, text }: { postId: string; text: string }) =>
      feedApi.createComment(postId, text, accessToken),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUpdateComment() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      feedApi.updateComment(commentId, text, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useDeleteComment() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      feedApi.deleteComment(commentId, accessToken),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useLikeComment() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      feedApi.likeComment(commentId, accessToken),
    onSuccess: (_, { postId }) =>
      queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useUnlikeComment() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      feedApi.unlikeComment(commentId, accessToken),
    onSuccess: (_, { postId }) =>
      queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useCreateStory() {
  const accessToken = useToken();
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (input: feedApi.CreateStoryInput) => feedApi.createStory(input, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      showToast('Story posted.');
    },
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}

export function useViewStory() {
  const accessToken = useToken();
  return useMutation({
    mutationFn: (storyId: string) => feedApi.viewStory(storyId, accessToken),
  });
}

export function useLikeStory() {
  const accessToken = useToken();
  const showToast = useToastStore((s) => s.show);
  return useMutation({
    mutationFn: (storyId: string) => feedApi.likeStory(storyId, accessToken),
    onError: (err) => showToast(friendlyErrorMessage(err)),
  });
}
