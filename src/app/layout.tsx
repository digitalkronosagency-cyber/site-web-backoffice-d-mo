import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Électricité Dumont — Électricien à Lyon',
  description:
    "Électricien qualifié à Lyon : installation électrique, mise aux normes, dépannage urgence, borne de recharge. Devis gratuit sous 24h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
