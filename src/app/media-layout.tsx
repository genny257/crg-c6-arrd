
"use client";

import type { ReactNode } from "react";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicLayout } from "@/components/public-layout";

const tabs = [
    { name: "Blog", href: "/blog" },
    { name: "Rapports", href: "/reports" },
    { name: "Évènements", href: "/events" },
];

export default function MediaLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <PublicLayout>
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Tabs value={pathname.split('/')[1]} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.href} value={tab.href.substring(1)} asChild>
                        <Link href={tab.href}>{tab.name}</Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
        {children}
      </main>
    </PublicLayout>
  );
}

    