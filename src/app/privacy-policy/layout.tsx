import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Consultez la politique de confidentialité de la Croix-Rouge Gabonaise, Comité du 6ème Arrondissement.',
};

export default function PrivacyPolicyLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
