import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { serviceSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', issues: parsed.error.flatten() }, { status: 400 });
  }

  const count = await prisma.service.count();

  const service = await prisma.service.create({
    data: { ...parsed.data, order: count },
  });

  return NextResponse.json(service, { status: 201 });
}
