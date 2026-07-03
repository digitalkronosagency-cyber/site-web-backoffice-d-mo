import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { serviceSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', issues: parsed.error.flatten() }, { status: 400 });
  }

  const service = await prisma.service.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(service);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  await prisma.service.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
