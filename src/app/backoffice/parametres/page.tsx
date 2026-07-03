import { getServerSession } from '@/lib/auth';
import { Card } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function ParametresPage() {
  const session = await getServerSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-900">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-500">Configuration du compte administrateur</p>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-brand-900">Compte administrateur</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="text-gray-500">Email connecté</dt>
            <dd className="font-medium text-gray-800">{session?.email}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-6">
        <h3 className="mb-2 font-semibold text-brand-900">À propos de la configuration</h3>
        <p className="text-sm text-gray-500">
          Les identifiants sensibles (email administrateur, clés API, secrets) sont gérés via les variables
          d&apos;environnement Vercel et ne sont pas modifiables depuis cette interface, pour des raisons de
          sécurité. Consultez le fichier <code className="rounded bg-gray-100 px-1 py-0.5">.env.example</code> et le{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5">README.md</code> du projet pour la liste complète et
          les instructions de configuration.
        </p>
      </Card>
    </div>
  );
}
