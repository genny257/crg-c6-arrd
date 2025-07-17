import type { ReactNode } from "react";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppNav } from "@/components/app-nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar" collapsible="icon" className="hidden md:flex">
            <AppNav />
        </Sidebar>
        <div className="flex flex-col w-full">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
