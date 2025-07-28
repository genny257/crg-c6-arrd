// src/app/dashboard/settings/partners/page.tsx
"use client"

import * as React from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
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
import type { Partner } from "@/types/homepage";

const partnerSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  logoUrl: z.string().url("L'URL du logo est invalide."),
  websiteUrl: z.string().url("L'URL du site est invalide.").optional().or(z.literal('')),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

const PartnerForm = ({ partner, onSave, onCancel, isSaving }: { partner?: Partner, onSave: (data: any) => void, onCancel: () => void, isSaving: boolean }) => {
    const form = useForm<PartnerFormValues>({
        resolver: zodResolver(partnerSchema),
        defaultValues: {
            name: partner?.name || "",
            logoUrl: partner?.logoUrl || "",
            websiteUrl: partner?.websiteUrl || "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 border p-4 rounded-lg bg-muted/50 my-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Nom du partenaire</FormLabel><FormControl><Input placeholder="Nom de l'entreprise" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="logoUrl" render={({ field }) => (
                    <FormItem><FormLabel>URL du logo</FormLabel><FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                    <FormItem><FormLabel>URL du site web (optionnel)</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enregistrer
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default function PartnerSettingsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = React.useState<Partner[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingPartner, setEditingPartner] = React.useState<Partner | null>(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchPartners = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partners`);
      if (!response.ok) throw new Error("Failed to fetch partners");
      const data = await response.json();
      setPartners(data);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les partenaires.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleSave = async (data: PartnerFormValues) => {
    setIsSaving(true);
    const isNew = !editingPartner?.id;
    const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/partners` : `${process.env.NEXT_PUBLIC_API_URL}/partners/${editingPartner?.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("L'enregistrement a échoué.");
        toast({ title: "Succès", description: "Le partenaire a été enregistré." });
        setIsCreatingNew(false);
        setEditingPartner(null);
        fetchPartners();
    } catch (error) {
        toast({ title: "Erreur", description: "L'enregistrement a échoué.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partners/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("La suppression a échoué.");
        toast({ title: "Succès", description: "Le partenaire a été supprimé." });
        fetchPartners();
    } catch (error) {
        toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive" });
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Partenaires</CardTitle>
          <CardDescription>Ajoutez, modifiez ou supprimez les logos des partenaires affichés sur la page d'accueil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                {partners.map((partner) => (
                    editingPartner?.id === partner.id ? (
                        <PartnerForm 
                            key={partner.id}
                            partner={editingPartner} 
                            onSave={handleSave}
                            onCancel={() => setEditingPartner(null)} 
                            isSaving={isSaving}
                        />
                    ) : (
                        <div key={partner.id} className="flex items-center justify-between p-2 border rounded-lg">
                           <div className="flex items-center gap-4">
                             <Image src={partner.logoUrl} alt={partner.name} width={80} height={40} className="object-contain"/>
                             <p className="font-medium">{partner.name}</p>
                           </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingPartner(partner)}>Modifier</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">Supprimer</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                            <AlertDialogDescription>Cette action est irréversible. Le partenaire "{partner.name}" sera supprimé.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(partner.id)}>Supprimer</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {isCreatingNew ? (
                 <PartnerForm 
                    onSave={handleSave}
                    onCancel={() => setIsCreatingNew(false)} 
                    isSaving={isSaving}
                />
            ) : (
                <Button variant="outline" className="mt-4" onClick={() => setIsCreatingNew(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un nouveau partenaire
                </Button>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
