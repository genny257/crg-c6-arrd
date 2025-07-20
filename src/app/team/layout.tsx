
import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';

export default function TeamLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}

    