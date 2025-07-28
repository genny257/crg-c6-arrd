
import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contactez-nous',
  description: 'Contactez le comité du 6ème arrondissement de la Croix-Rouge Gabonaise. Nous sommes à votre écoute pour toute question ou suggestion.',
};


export default function ContactLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
