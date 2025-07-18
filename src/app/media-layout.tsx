
"use client";

import type { ReactNode } from "react";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

const tabs = [
    { name: "Blog", href: "/blog" },
    { name: "Rapports", href: "/reports" },
    { name: "Évènements", href: "/events" },
];

export default function MediaLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <div className="bg-background min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm z-20 sticky top-0">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40ZM26 22V12H22V22H12V26H22V36H26V26H36V22H26Z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Croix-Rouge Gabonaise</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Accueil</Link>
            <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4">Équipe</Link>
            <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium hover:underline underline-offset-4 px-0">
                  Média <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/blog">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/reports">Rapports</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/events">Évènements</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {!loading && user ? (
                <Button asChild variant="ghost">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
            ) : (
                <Button asChild variant="ghost">
                    <Link href="/login">Connexion</Link>
                </Button>
            )}
            <Button asChild>
                <Link href="/donations">Faire un Don</Link>
            </Button>
        </nav>
        <div className="ml-auto md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                <span className="sr-only">Ouvrir le menu</span>
            </Button>
        </div>
      </header>

      {isMenuOpen && (
          <div className="fixed top-14 left-0 w-full md:hidden bg-background shadow-md z-50">
              <nav className="flex flex-col items-center gap-4 p-4">
                  <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                  <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Équipe</Link>
                  <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  <Link href="/blog" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                  <Link href="/reports" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Rapports</Link>
                  <Link href="/events" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Évènements</Link>
                   <div className="flex flex-col gap-4 w-full items-center mt-4 border-t pt-4">
                        {!loading && user ? (
                            <Button asChild variant="ghost" className="w-full">
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild variant="ghost" className="w-full">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                            </Button>
                        )}
                        <Button asChild className="w-full">
                            <Link href="/donations" onClick={() => setIsMenuOpen(false)}>Faire un Don</Link>
                        </Button>
                   </div>
              </nav>
          </div>
      )}

      <main className="container mx-auto px-4 py-8 md:py-16">
        <Tabs value={pathname} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.href} value={tab.href} asChild>
                        <Link href={tab.href}>{tab.name}</Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
        {children}
      </main>
      
       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-muted-foreground">&copy; 2024 Croix-Rouge Gabonaise. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Termes & Conditions
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  );
}
