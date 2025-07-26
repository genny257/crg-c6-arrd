"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = React.useState<Event | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // @ts-ignore
    const promptResult = await installPrompt.prompt();
    
    // @ts-ignore
    const { outcome } = await promptResult.userChoice;

    if (outcome === 'accepted') {
      toast({
        title: "Installation réussie",
        description: "L'application a été ajoutée à votre écran d'accueil.",
      });
    }

    setInstallPrompt(null);
  };

  if (!installPrompt) {
    return null;
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleInstallClick} className="text-xs text-muted-foreground hover:text-foreground">
      <Download className="mr-2 h-3 w-3" />
      Installer l'application
    </Button>
  );
}
