"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"
import { PublicLayout } from "@/components/public-layout"

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center text-center py-20">
        <SearchX className="h-20 w-20 text-destructive mb-4" />
        <h1 className="text-6xl font-headline font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page non trouvée</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
           <Button asChild variant="ghost">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  )
}
