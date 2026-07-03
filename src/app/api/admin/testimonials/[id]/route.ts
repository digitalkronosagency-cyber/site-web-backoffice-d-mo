import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { testimonialSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', issues: parsed.error.flatten() }, { status: 400 });
  }

  const { date, ...rest } = parsed.data;

  const testimonial = await prisma.testimonial.update({
    where: { id: params.id },
    data: { ...rest, ...(date ? { date: new Date(date) } : {}) },
  });

  return NextResponse.json(testimonial);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { response } = await requireAdmin();
  if (response) return response;

  await prisma.testimonial.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
