import { put, del } from '@vercel/blob';

export async function uploadFile(pathname: string, body: Buffer | Blob, contentType?: string) {
  const blob = await put(pathname, body, {
    access: 'public',
    contentType,
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteFile(url: string) {
  await del(url);
}
