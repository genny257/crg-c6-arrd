
import { PublicLayout } from '@/components/public-layout';
import type { ReactNode } from 'react';

export default function HymneLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
