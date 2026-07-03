'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PhotoItem {
  id: string;
  url: string;
  alt: string | null;
}

export function PhotosUploader({ photos: initial }: { photos: PhotoItem[] }) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/photos', { method: 'POST', body: formData });
      const created = await res.json();
      setPhotos((prev) => [...prev, created]);
      router.refresh();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function deletePhoto(id: string) {
    await fetch(`/api/admin/photos/${id}`, { method: 'DELETE' });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.alt ?? ''} className="h-full w-full object-cover" />
            <button
              onClick={() => deletePhoto(photo.id)}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" id="photo-upload" />
        <label htmlFor="photo-upload">
          <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
            <Upload size={16} /> {uploading ? 'Envoi en cours...' : 'Ajouter une photo'}
          </Button>
        </label>
      </div>
    </div>
  );
}
