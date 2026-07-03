import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth';
import { Sidebar } from '@/components/backoffice/Sidebar';

export const dynamic = 'force-dynamic';

export default async function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar email={session.email} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
