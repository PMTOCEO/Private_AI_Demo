import { API_CONFIG } from './config';
import { UploadResponse } from '../Utilities/types';

export async function requestUploadUrl(
  token: string, 
  filename: string, 
  fileType: string
): Promise<UploadResponse> {
  const response = await fetch(`${API_CONFIG.apiBase}/document/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filename, type: fileType })
  });

  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }

  return response.json();
}

export async function uploadFileToSignedUrl(
  signedUrl: string, 
  file: File
): Promise<void> {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }
}