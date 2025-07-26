// src/app/dashboard/settings/payments/page.tsx
"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Banknote, CheckCircle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type PaymentService = {
  id: string;
  name: string;
  isActive: boolean;
  isDefault: boolean;
  apiKeys?: { [key: string]: string };
};

export default function PaymentSettingsPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [services, setServices] = React.useState<PaymentService[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingService, setEditingService] = React.useState<PaymentService | null>(null);

  const fetchServices = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les services de paiement.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  React.useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'SUPERADMIN') {
        toast({ title: "Accès refusé", variant: "destructive" });
        router.push('/dashboard');
      } else {
        fetchServices();
      }
    }
  }, [user, authLoading, router, toast, fetchServices]);

  const handleToggleActive = async (service: PaymentService) => {
    if (service.isDefault && service.isActive) {
      toast({ title: "Action impossible", description: "Le service par défaut ne peut pas être désactivé.", variant: "destructive" });
      return;
    }
    await updateService(service.id, { isActive: !service.isActive });
  };

  const handleSetDefault = async (serviceId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-services/${serviceId}/set-default`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to set default service");
      toast({ title: "Succès", description: "Le service par défaut a été mis à jour." });
      fetchServices();
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de définir le service par défaut.", variant: "destructive" });
    }
  };

  const updateService = async (id: string, data: Partial<PaymentService>) => {
     try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update service");
      toast({ title: "Succès", description: "Service mis à jour." });
      fetchServices();
      setEditingService(null);
    } catch (error) {
      toast({ title: "Erreur", description: "La mise à jour a échoué.", variant: "destructive" });
    }
  };
  
  const handleKeysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingService) return;
    const {name, value} = e.target;
    setEditingService({
      ...editingService,
      apiKeys: {
        ...editingService.apiKeys,
        [name]: value
      }
    });
  }

  if (loading || authLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Services de Paiement</CardTitle>
          <CardDescription>Gérez les fournisseurs de services de paiement pour les dons.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Banknote className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">{service.name}
                    {service.isDefault && <Badge className="ml-2">Défaut</Badge>}
                    {service.isActive && <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Activé</Badge>}
                  </p>
                  <p className="text-sm text-muted-foreground">Gérer l'état et les clés du service.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={service.isActive}
                  onCheckedChange={() => handleToggleActive(service)}
                  aria-label={`Activer ${service.name}`}
                />
                 <Button variant="outline" size="sm" onClick={() => handleSetDefault(service.id)} disabled={service.isDefault}>
                   Définir par défaut
                </Button>
                 <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingService(service)}>Gérer les clés</Button>
                </AlertDialogTrigger>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <AlertDialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gérer les clés pour {editingService?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Entrez les clés API pour ce service. Ces informations sont sensibles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {editingService && (
            <div className="space-y-4 py-4">
               <div className="space-y-2">
                <Label htmlFor="publicKey">Clé Publique</Label>
                <Input id="publicKey" name="publicKey" value={editingService.apiKeys?.publicKey || ''} onChange={handleKeysChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="secretKey">Clé Secrète</Label>
                <Input id="secretKey" name="secretKey" type="password" value={editingService.apiKeys?.secretKey || ''} onChange={handleKeysChange} />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => editingService && updateService(editingService.id, {apiKeys: editingService.apiKeys})}>
              Enregistrer les clés
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
