import Link from 'next/link';

interface FooterProps {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
}

export function Footer({ companyName, phone, email, address, postalCode, city }: FooterProps) {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">{companyName}</h3>
            <p className="text-sm">{address}</p>
            <p className="text-sm">
              {postalCode} {city}
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">Contact</h3>
            <p className="text-sm">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white">
                {phone}
              </a>
            </p>
            <p className="text-sm">
              <a href={`mailto:${email}`} className="hover:text-white">
                {email}
              </a>
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">Informations</h3>
            <Link href="/mentions-legales" className="block text-sm hover:text-white">
              Mentions légales
            </Link>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-brand-300 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {companyName}. Tous droits réservés.
          </span>
          <Link href="/admin" className="text-brand-400 hover:text-brand-200">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
