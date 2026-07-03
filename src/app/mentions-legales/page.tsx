import { prisma } from '@/lib/prisma';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

export const dynamic = 'force-dynamic';

export default async function MentionsLegalesPage() {
  const company = await prisma.company.findFirst();
  const companyName = company?.name ?? 'Électricité Dumont';
  const phone = company?.phone ?? '';

  return (
    <>
      <Header companyName={companyName} phone={phone} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-brand-900">Mentions légales</h1>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            <strong>Raison sociale :</strong> {companyName}
          </p>
          <p>
            <strong>Adresse :</strong> {company?.address}, {company?.postalCode} {company?.city}
          </p>
          <p>
            <strong>SIRET :</strong> {company?.siret}
          </p>
          <p>
            <strong>N° TVA intracommunautaire :</strong> {company?.tvaNumber}
          </p>
          <p>
            <strong>Téléphone :</strong> {company?.phone}
          </p>
          <p>
            <strong>Email :</strong> {company?.email}
          </p>
          <p>
            <strong>Directeur de la publication :</strong> {companyName}
          </p>
          <p>
            <strong>Hébergement :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
          </p>
        </div>
      </main>
      <Footer
        companyName={companyName}
        phone={company?.phone ?? ''}
        email={company?.email ?? ''}
        address={company?.address ?? ''}
        postalCode={company?.postalCode ?? ''}
        city={company?.city ?? ''}
      />
    </>
  );
}
