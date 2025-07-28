import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';

export default function RendezVousLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
