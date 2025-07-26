"use client" // Error components must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PublicLayout } from "@/components/public-layout"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center text-center py-20">
         <AlertTriangle className="h-20 w-20 text-amber-500 mb-4" />
        <h2 className="text-2xl font-semibold mt-4">Une erreur est survenue</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Quelque chose s'est mal passé. Notre équipe a été notifiée.
        </p>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="mt-8"
        >
          Réessayer
        </Button>
      </div>
    </PublicLayout>
  )
}
