import { put, del } from '@vercel/blob';
import { withTimeout } from '@/lib/with-timeout';

const BLOB_TIMEOUT_MS = 20_000;

export async function uploadFile(pathname: string, body: Buffer | Blob, contentType?: string) {
  const blob = await withTimeout(
    put(pathname, body, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    }),
    BLOB_TIMEOUT_MS,
    'Vercel Blob (upload)'
  );
  return blob.url;
}

export async function deleteFile(url: string) {
  await withTimeout(del(url), BLOB_TIMEOUT_MS, 'Vercel Blob (suppression)');
}
