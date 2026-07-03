import Link from 'next/link';
import { AdminLoginForm } from '@/components/public/AdminLoginForm';

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-950 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-xl font-bold text-brand-900">Espace administrateur</h1>
        <p className="mb-6 text-sm text-gray-500">
          Saisissez votre email pour recevoir un lien de connexion sécurisé.
        </p>
        {searchParams.error === 'expired' && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            Ce lien est invalide ou a expiré. Merci de refaire une demande.
          </div>
        )}
        <AdminLoginForm />
        <Link href="/" className="mt-6 block text-center text-xs text-gray-400 hover:text-gray-600">
          Retour au site
        </Link>
      </div>
    </div>
  );
}
