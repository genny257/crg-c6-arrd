
import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';

export default function MecenatLayout({ children }: { children: ReactNode }) {
  return (
    <PublicLayout>
        <main className="container mx-auto px-4 py-8 md:py-16">
            {children}
        </main>
    </PublicLayout>
  );
}
