
import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faire un Don',
  description: 'Soutenez les actions de la Croix-Rouge Gabonaise. Votre contribution aide à sauver des vies et à soutenir les communautés vulnérables.',
};

export default function DonationLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
