
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { ArchivePickerDialog, SelectedFileDisplay } from "@/components/archive-picker-dialog";
import type { ArchiveItem } from "@/types/archive";


const reportSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  fileUrl: z.string().url("Veuillez sélectionner un fichier depuis les archives."),
  visible: z.boolean().default(false),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function NewReportPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      fileUrl: "",
      visible: false,
    },
  });
  
  const handleFileSelect = (file: ArchiveItem) => {
    form.setValue("fileUrl", file.url || "");
    form.setValue("title", file.name.replace(/\.[^/.]+$/, "")); // Remove extension for title
    setIsPickerOpen(false);
  }

  const onSubmit = async (data: ReportFormValues) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("La création a échoué.");
      
      toast({
        title: "Rapport créé",
        description: "Le nouveau rapport a été ajouté avec succès.",
      });
      router.push("/dashboard/reports");
      router.refresh();
    } catch (error) {
      console.error("Error creating report: ", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du rapport.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return <div>Chargement...</div>
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
     router.push('/login');
     return null;
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
             <Button asChild variant="outline" size="icon">
                <Link href="/dashboard/reports">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-3xl font-headline font-bold">Nouveau Rapport</h1>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Ajouter un nouveau rapport</CardTitle>
                <CardDescription>Sélectionnez un fichier depuis vos archives et configurez sa visibilité.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                 <Controller
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Fichier du Rapport</FormLabel>
                          <SelectedFileDisplay 
                            fileUrl={field.value}
                            onSelectFile={() => setIsPickerOpen(true)}
                          />
                        <FormMessage />
                     </FormItem>
                  )}
                />
                
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titre du rapport</FormLabel>
                        <FormControl>
                        <Input placeholder="Titre qui sera affiché publiquement" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                  control={form.control}
                  name="visible"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Visibilité</FormLabel>
                         <p className="text-sm text-muted-foreground">
                            Rendre ce rapport visible publiquement dès sa création.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Publication..." : "Publier le rapport"}
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>

        <ArchivePickerDialog 
            isOpen={isPickerOpen}
            onOpenChange={setIsPickerOpen}
            onFileSelect={handleFileSelect}
        />
    </div>
  );
}
