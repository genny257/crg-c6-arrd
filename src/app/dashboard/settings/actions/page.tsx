// src/app/dashboard/settings/actions/page.tsx
"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Trash2, GripVertical, Loader2 } from "lucide-react";
import type { ActionSection } from "@/types/homepage";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


const actionSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  image: z.string().url("L'URL de l'image est invalide."),
  imageHint: z.string().optional(),
  dialogTitle: z.string().min(1, "Le titre du dialogue est requis."),
  dialogDescription: z.string().min(1, "La description du dialogue est requise."),
  dialogList: z.array(z.object({ value: z.string().min(1, "L'élément de liste ne peut pas être vide.") })).min(1, "Ajoutez au moins un élément à la liste."),
});

type ActionFormValues = z.infer<typeof actionSchema>;


const ActionForm = ({ action, onSave, onCancel, isSaving }: { action?: ActionSection, onSave: (data: any) => void, onCancel: () => void, isSaving: boolean }) => {
    const form = useForm<ActionFormValues>({
        resolver: zodResolver(actionSchema),
        defaultValues: {
            title: action?.title || "",
            description: action?.description || "",
            image: action?.image || "",
            imageHint: action?.imageHint || "",
            dialogTitle: action?.dialogTitle || "",
            dialogDescription: action?.dialogDescription || "",
            dialogList: action?.dialogList.map(item => ({value: item})) || [{value: ""}],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "dialogList",
    });

    const onSubmit = (data: ActionFormValues) => {
        onSave({
            ...data,
            dialogList: data.dialogList.map(item => item.value)
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Titre de la carte</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="image" render={({ field }) => (
                        <FormItem><FormLabel>URL de l'image</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description de la carte</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <h4 className="text-md font-semibold pt-4 border-t">Contenu du dialogue "En savoir plus"</h4>
                 <FormField control={form.control} name="dialogTitle" render={({ field }) => (
                    <FormItem><FormLabel>Titre du dialogue</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="dialogDescription" render={({ field }) => (
                    <FormItem><FormLabel>Description du dialogue</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div>
                    <FormLabel>Liste à puces du dialogue</FormLabel>
                    <div className="space-y-2 mt-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                             <FormField
                                control={form.control}
                                name={`dialogList.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                    </div>
                     <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => append({ value: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un élément
                    </Button>
                </div>

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


export default function HomepageSettingsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [actions, setActions] = React.useState<ActionSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingAction, setEditingAction] = React.useState<ActionSection | null>(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchActions = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/actions`);
      if (!response.ok) throw new Error("Failed to fetch actions");
      const data = await response.json();
      setActions(data);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les sections 'Actions'.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    const isNew = !editingAction?.id;
    const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/actions` : `${process.env.NEXT_PUBLIC_API_URL}/actions/${editingAction?.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("L'enregistrement a échoué.");
        toast({ title: "Succès", description: "La section a été enregistrée." });
        setIsCreatingNew(false);
        setEditingAction(null);
        fetchActions();
    } catch (error) {
        toast({ title: "Erreur", description: "L'enregistrement a échoué.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/actions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("La suppression a échoué.");
        toast({ title: "Succès", description: "La section a été supprimée." });
        fetchActions();
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
          <CardTitle>Contenu de la Page d'Accueil</CardTitle>
          <CardDescription>Gérez les sections de la page d'accueil. Réorganisez-les par glisser-déposer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Section "Nos Actions"</h3>
            <div className="space-y-2">
            {actions.map((action) => (
                <Collapsible key={action.id} className="border rounded-lg p-4">
                    {editingAction?.id === action.id ? (
                        <ActionForm 
                            action={editingAction} 
                            onSave={handleSave}
                            onCancel={() => setEditingAction(null)} 
                            isSaving={isSaving}
                        />
                    ) : (
                        <div className="flex items-center justify-between">
                             <CollapsibleTrigger asChild>
                                <div className="flex items-center gap-4 cursor-pointer flex-1">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    <p className="font-medium">{action.title}</p>
                                </div>
                            </CollapsibleTrigger>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingAction(action)}>Modifier</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">Supprimer</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                            <AlertDialogDescription>Cette action est irréversible. La section "{action.title}" sera supprimée définitivement.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(action.id)}>Supprimer</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    )}
                    <CollapsibleContent className="mt-4">
                         <ActionForm 
                            action={action} 
                            onSave={(data) => handleSave({...data, id: action.id})}
                            onCancel={() => {}} 
                            isSaving={isSaving}
                        />
                    </CollapsibleContent>
                </Collapsible>
            ))}
            </div>

            {isCreatingNew ? (
                 <ActionForm 
                    onSave={handleSave}
                    onCancel={() => setIsCreatingNew(false)} 
                    isSaving={isSaving}
                />
            ) : (
                <Button variant="outline" className="mt-4" onClick={() => setIsCreatingNew(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une nouvelle action
                </Button>
            )}

        </CardContent>
      </Card>
    </div>
  );
}
