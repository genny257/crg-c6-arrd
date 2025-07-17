import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TeamLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm z-10 sticky top-0">
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
          <span className="sr-only">Gabon Relief Hub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Accueil</Link>
            <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                Équipe
            </Link>
            <Button asChild variant="ghost">
                <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
                <Link href="/donations">Faire un Don</Link>
            </Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8 md:py-16">
        {children}
      </main>
    </div>
  );
}
