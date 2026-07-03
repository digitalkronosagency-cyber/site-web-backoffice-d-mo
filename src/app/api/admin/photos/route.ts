import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { uploadFile } from '@/lib/blob';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const photos = await prisma.photo.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const pathname = `photos/${Date.now()}-${file.name}`;
  const url = await uploadFile(pathname, buffer, file.type);

  const count = await prisma.photo.count();

  const photo = await prisma.photo.create({
    data: { url, alt: file.name, order: count },
  });

  return NextResponse.json(photo, { status: 201 });
}
