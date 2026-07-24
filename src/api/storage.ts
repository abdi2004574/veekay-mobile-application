import { apiFetch } from './client';

export type MediaPurpose =
  | 'profile_photo'
  | 'previous_trip_photo'
  | 'post_media'
  | 'story_media'
  | 'agency_document'
  | 'agency_logo';

export interface UploadUrlResponse {
  uploadUrl: string;
  mediaId: string;
  key: string;
}

export function createUploadUrl(
  contentType: string,
  purpose: MediaPurpose,
  accessToken: string,
) {
  return apiFetch<UploadUrlResponse>('/storage/upload-url', {
    method: 'POST',
    body: { contentType, purpose },
    accessToken,
  });
}

export function confirmUpload(mediaId: string, accessToken: string) {
  return apiFetch<{ id: string; status: string }>('/storage/confirm', {
    method: 'POST',
    body: { mediaId },
    accessToken,
  });
}
