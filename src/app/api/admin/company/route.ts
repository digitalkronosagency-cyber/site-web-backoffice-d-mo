import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { companySchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  const company = await prisma.company.findFirst();
  return NextResponse.json(company);
}

export async function PATCH(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const parsed = companySchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', issues: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.company.findFirst();

  const company = existing
    ? await prisma.company.update({ where: { id: existing.id }, data: parsed.data })
    : await prisma.company.create({
        data: {
          name: parsed.data.name ?? 'Électricité Dumont',
          phone: parsed.data.phone ?? '',
          email: parsed.data.email ?? '',
          address: parsed.data.address ?? '',
          postalCode: parsed.data.postalCode ?? '',
          city: parsed.data.city ?? '',
          siret: parsed.data.siret ?? '',
          tvaNumber: parsed.data.tvaNumber ?? '',
          description: parsed.data.description ?? '',
          cities: parsed.data.cities ?? [],
          logoUrl: parsed.data.logoUrl,
          heroImageUrl: parsed.data.heroImageUrl,
        },
      });

  return NextResponse.json(company);
}
