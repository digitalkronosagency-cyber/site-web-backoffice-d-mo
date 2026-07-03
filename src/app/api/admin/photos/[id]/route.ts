import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { deleteFile } from '@/lib/blob';

export const dynamic = 'force-dynamic';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const photo = await prisma.photo.findUnique({ where: { id: params.id } });
  if (!photo) return NextResponse.json({ error: 'Photo introuvable' }, { status: 404 });

  try {
    await deleteFile(photo.url);
  } catch (err) {
    console.error('Erreur suppression Blob:', err);
  }

  await prisma.photo.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
