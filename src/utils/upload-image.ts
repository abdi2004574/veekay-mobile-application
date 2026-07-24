import * as ImagePicker from 'expo-image-picker';
import { createUploadUrl, confirmUpload, type MediaPurpose } from '../api/storage';

export interface UploadedImage {
  mediaId: string;
  previewUri: string;
}

async function uploadPickedAsset(
  asset: ImagePicker.ImagePickerAsset,
  purpose: MediaPurpose,
  accessToken: string,
): Promise<UploadedImage> {
  const contentType = asset.mimeType ?? 'image/jpeg';
  const { uploadUrl, mediaId } = await createUploadUrl(contentType, purpose, accessToken);

  const fileBlob = await (await fetch(asset.uri)).blob();
  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: fileBlob,
  });
  if (!putRes.ok) {
    throw new Error('Could not upload the photo. Please try again.');
  }

  await confirmUpload(mediaId, accessToken);
  return { mediaId, previewUri: asset.uri };
}

/** Returns null if the user cancels or denies permission — callers should just no-op on null. */
export async function pickAndUploadFromLibrary(
  purpose: MediaPurpose,
  accessToken: string,
): Promise<UploadedImage | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library access was denied. Enable it in Settings to add photos.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return uploadPickedAsset(result.assets[0], purpose, accessToken);
}

export async function pickAndUploadFromCamera(
  purpose: MediaPurpose,
  accessToken: string,
): Promise<UploadedImage | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Camera access was denied. Enable it in Settings to take a photo.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return uploadPickedAsset(result.assets[0], purpose, accessToken);
}
