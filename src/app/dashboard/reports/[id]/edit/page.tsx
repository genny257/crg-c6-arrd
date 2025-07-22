
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import type { Report } from "@/types/report";

const reportSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  fileUrl: z.string().url("L'URL du fichier n'est pas valide."),
  visible: z.boolean().default(false),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function EditReportPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const { user, loading: authLoading, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });

  React.useEffect(() => {
    if (typeof id !== 'string' || !token) return;
    const fetchReport = async () => {
        setPageLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Rapport non trouvé.");
            const reportData: Report = await response.json();
            form.reset(reportData);
        } catch (error) {
            toast({ title: "Erreur", description: "Rapport non trouvé.", variant: "destructive" });
            router.push('/dashboard/reports');
        } finally {
            setPageLoading(false);
        }
    };
    fetchReport();
  }, [id, form, router, toast, token]);

  const onSubmit = async (data: ReportFormValues) => {
    if(typeof id !== 'string' || !token) return;
    setIsSubmitting(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("La mise à jour a échoué.");

      toast({
        title: "Rapport modifié",
        description: "Le rapport a été mis à jour avec succès.",
      });
      router.push('/dashboard/reports');
      router.refresh();
    } catch (error) {
      console.error("Error updating report: ", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du rapport.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading) return <div>Chargement...</div>;
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
     router.push('/login');
     return null;
  }

  if (pageLoading) {
      return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-8 w-1/3" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
             <Button asChild variant="outline" size="icon">
                <Link href={`/dashboard/reports`}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-3xl font-headline font-bold">Modifier le Rapport</h1>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Détails du rapport</CardTitle>
                <CardDescription>Mettez à jour les informations du rapport ci-dessous.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titre du rapport</FormLabel>
                        <FormControl>
                        <Input placeholder="Rapport Annuel 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>URL du fichier</FormLabel>
                        <FormControl>
                        <Input type="url" placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                            Collez ici le lien vers le fichier PDF hébergé.
                        </FormDescription>
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
                            Rendre ce rapport visible publiquement.
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
                        {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    </div>
  );
}
