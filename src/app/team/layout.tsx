
import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notre Équipe',
  description: 'Découvrez l\'organisation, les coordinateurs et les volontaires qui animent le comité du 6ème arrondissement de la Croix-Rouge Gabonaise.',
};

export default function TeamLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
