
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
import { ChevronDown, Menu, X, LayoutDashboard, Building } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

const publicNavLinks = [
  { href: "/#actions", label: "Nos Actions" },
  { href: "/team", label: "Équipe" },
  { href: "/contact", label: "Contact" },
];

const mediaNavLinks = [
    { href: "/blog", label: "Blog" },
    { href: "/reports", label: "Rapports" },
    { href: "/events", label: "Évènements" },
    { href: "/principes", label: "Principes CRG" },
    { href: "/hymne", label: "Hymne CRG" },
]

export function PublicLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, loading } = useAuth();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm z-20 sticky top-0">
        <Link href="/" className="flex items-center justify-start gap-2" prefetch={false}>
            <Image src="/logo.png" alt="Croix-Rouge Gabonaise Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
            <span className="font-semibold hidden sm:inline-block">Croix-Rouge Gabonaise</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
            {publicNavLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium hover:underline underline-offset-4">{link.label}</Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium hover:underline underline-offset-4 px-0 flex items-center gap-1">
                  Média <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {mediaNavLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
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
                  {[...publicNavLinks, ...mediaNavLinks].map(link => (
                     <Link key={link.href} href={link.href} className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
                  ))}
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

      <div className="flex-1">{children}</div>
      
       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-muted-foreground">&copy; 2024 Croix-Rouge Gabonaise. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/mecenat" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Mécénat
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Politique de confidentialité
          </Link>
        </nav>
      </footer>
    </div>
  );
}
