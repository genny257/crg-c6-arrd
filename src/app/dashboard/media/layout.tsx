
import type { ReactNode } from "react";

export default function MediaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
        {children}
    </div>
  )
}
