
"use client"
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const tabs = [
    { name: "Blog", href: "/dashboard/media/blog" },
    { name: "Rapports", href: "/dashboard/media/reports" },
    { name: "Évènements", href: "/dashboard/media/events" },
]

export default function MediaLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col gap-8">
        <Tabs value={pathname} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.href} value={tab.href} asChild>
                        <Link href={tab.href}>{tab.name}</Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
        {children}
    </div>
  )
}
