
import MediaLayout from '../media-layout';
import type { ReactNode } from 'react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <MediaLayout>{children}</MediaLayout>;
}
