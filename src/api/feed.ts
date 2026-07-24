import { apiFetch } from './client';
import type { Comment, Page, Post, Story } from './types';

function withQuery(path: string, params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return query ? `${path}?${query}` : path;
}

export interface CreatePostInput {
  text: string;
  imageMediaId?: string;
  location?: string;
  tags?: string[];
}

export function createPost(input: CreatePostInput, accessToken: string) {
  return apiFetch<Post>('/posts', { method: 'POST', body: input, accessToken });
}

export function updatePost(
  postId: string,
  input: Partial<CreatePostInput>,
  accessToken: string,
) {
  return apiFetch<Post>(`/posts/${postId}`, {
    method: 'PATCH',
    body: input,
    accessToken,
  });
}

export function deletePost(postId: string, accessToken: string) {
  return apiFetch<void>(`/posts/${postId}`, { method: 'DELETE', accessToken });
}

export function likePost(postId: string, accessToken: string) {
  return apiFetch<void>(`/posts/${postId}/like`, { method: 'POST', accessToken });
}

export function unlikePost(postId: string, accessToken: string) {
  return apiFetch<void>(`/posts/${postId}/like`, { method: 'DELETE', accessToken });
}

export function sharePost(postId: string, caption: string | undefined, accessToken: string) {
  return apiFetch<Post>(`/posts/${postId}/share`, {
    method: 'POST',
    body: { caption },
    accessToken,
  });
}

export function getFeed(cursor: string | undefined, accessToken: string) {
  return apiFetch<Page<Post>>(withQuery('/feed', { cursor, limit: 20 }), { accessToken });
}

export function getUserPosts(
  userId: string,
  cursor: string | undefined,
  accessToken: string,
) {
  return apiFetch<Page<Post>>(withQuery(`/users/${userId}/posts`, { cursor, limit: 20 }), {
    accessToken,
  });
}

export function createComment(postId: string, text: string, accessToken: string) {
  return apiFetch<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: { text },
    accessToken,
  });
}

export function listComments(
  postId: string,
  cursor: string | undefined,
  accessToken: string,
) {
  return apiFetch<Page<Comment>>(
    withQuery(`/posts/${postId}/comments`, { cursor, limit: 30 }),
    { accessToken },
  );
}

export function updateComment(commentId: string, text: string, accessToken: string) {
  return apiFetch<Comment>(`/comments/${commentId}`, {
    method: 'PATCH',
    body: { text },
    accessToken,
  });
}

export function deleteComment(commentId: string, accessToken: string) {
  return apiFetch<void>(`/comments/${commentId}`, { method: 'DELETE', accessToken });
}

export function likeComment(commentId: string, accessToken: string) {
  return apiFetch<void>(`/comments/${commentId}/like`, { method: 'POST', accessToken });
}

export function unlikeComment(commentId: string, accessToken: string) {
  return apiFetch<void>(`/comments/${commentId}/like`, {
    method: 'DELETE',
    accessToken,
  });
}

export interface CreateStoryInput {
  imageMediaId?: string;
  text?: string;
  backgroundColor?: string;
  textSize?: 'small' | 'medium' | 'large';
}

export function createStory(input: CreateStoryInput, accessToken: string) {
  return apiFetch<Story>('/stories', { method: 'POST', body: input, accessToken });
}

export function listActiveStories(accessToken: string) {
  return apiFetch<Story[]>('/stories', { accessToken });
}

export function viewStory(storyId: string, accessToken: string) {
  return apiFetch<void>(`/stories/${storyId}/view`, { method: 'POST', accessToken });
}

export function likeStory(storyId: string, accessToken: string) {
  return apiFetch<void>(`/stories/${storyId}/like`, { method: 'POST', accessToken });
}
