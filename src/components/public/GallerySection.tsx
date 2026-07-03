interface PhotoItem {
  id: string;
  url: string;
  alt: string | null;
}

export function GallerySection({ photos }: { photos: PhotoItem[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Nos réalisations</h2>
        <p className="mt-2 text-gray-500">Quelques photos de nos derniers chantiers</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.alt ?? 'Photo de chantier'}
            loading="lazy"
            className="aspect-square w-full rounded-lg object-cover shadow-sm"
          />
        ))}
      </div>
    </section>
  );
}
