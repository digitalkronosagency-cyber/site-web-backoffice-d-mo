import { prisma } from '@/lib/prisma';
import { Header } from '@/components/public/Header';
import { Hero } from '@/components/public/Hero';
import { ServicesSection } from '@/components/public/ServicesSection';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';
import { WhyUsSection } from '@/components/public/WhyUsSection';
import { ServiceAreaSection } from '@/components/public/ServiceAreaSection';
import { GallerySection } from '@/components/public/GallerySection';
import { QuoteForm } from '@/components/public/QuoteForm';
import { Footer } from '@/components/public/Footer';

export const dynamic = 'force-dynamic';

async function getPageData() {
  const [company, services, testimonials, photos] = await Promise.all([
    prisma.company.findFirst(),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    prisma.photo.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return { company, services, testimonials, photos };
}

export default async function HomePage() {
  const { company, services, testimonials, photos } = await getPageData();

  const companyName = company?.name ?? 'Électricité Dumont';
  const phone = company?.phone ?? '04 78 12 34 56';

  return (
    <>
      <Header companyName={companyName} phone={phone} />
      <main>
        <Hero
          companyName={companyName}
          description={company?.description ?? 'Votre électricien de confiance à Lyon.'}
        />
        <ServicesSection services={services} />
        <TestimonialsSection testimonials={testimonials} />
        <WhyUsSection />
        <ServiceAreaSection cities={company?.cities ?? []} />
        <GallerySection photos={photos} />
        <section id="devis" className="bg-gray-100 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">Demandez votre devis gratuit</h2>
              <p className="mt-2 text-gray-500">Réponse sous 24h, sans engagement</p>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <Footer
        companyName={companyName}
        phone={phone}
        email={company?.email ?? 'contact@electricite-dumont.fr'}
        address={company?.address ?? ''}
        postalCode={company?.postalCode ?? ''}
        city={company?.city ?? 'Lyon'}
      />
    </>
  );
}
