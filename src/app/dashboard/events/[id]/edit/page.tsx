
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";

const eventSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  location: z.string().min(1, "Le lieu est requis."),
  date: z.date({ required_error: "La date de l'événement est requise." }),
  image: z.string().url("L'URL de l'image n'est pas valide.").optional().or(z.literal('')),
  imageHint: z.string().optional(),
  status: z.enum(['À venir', 'Terminé', 'Annulé']),
});

type EventFormValues = z.infer<typeof eventSchema>;

const mockEvent: Event = { id: '1', title: 'Grande Collecte de Sang', date: '2024-09-01T10:00:00Z', location: 'Siège du Comité, Libreville', description: 'Rejoignez-nous pour cette collecte vitale.', status: 'À venir', image: 'https://placehold.co/600x400.png' };

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(true);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  React.useEffect(() => {
    if (typeof id !== 'string') return;
    const fetchEvent = async () => {
        setPageLoading(true);
        // TODO: Replace with API call to /api/events/{id}
        const eventData = mockEvent;
        if (eventData) {
            form.reset({
                ...eventData,
                date: new Date(eventData.date),
            });
        } else {
            toast({ title: "Erreur", description: "Événement non trouvé.", variant: "destructive" });
            router.push('/events');
        }
        setPageLoading(false);
    };
    fetchEvent();
  }, [id, form, router, toast]);

  const onSubmit = async (data: EventFormValues) => {
    if(typeof id !== 'string') return;
    setIsSubmitting(true);
    try {
      // TODO: Replace with API call to PUT /api/events/{id}
      console.log("Updating event with data:", data);
      toast({
        title: "Événement modifié",
        description: "L'événement a été mis à jour avec succès (simulation).",
      });
      router.push('/events');
    } catch (error) {
      console.error("Error updating event: ", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'événement.",
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
                    <Skeleton className="h-24 w-full" />
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
                <Link href="/events">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-3xl font-headline font-bold">Modifier l'Événement</h1>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Informations de l'événement</CardTitle>
                <CardDescription>Mettez à jour les détails de l'événement ci-dessous.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre de l'événement</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: Grande Collecte de Sang" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lieu</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: Siège du Comité, Libreville" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date de l'événement</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP", { locale: fr })
                                    ) : (
                                        <span>Choisir une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    locale={fr}
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Décrivez l'événement..." rows={5} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Statut de l'événement</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Changer le statut" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="À venir">À venir</SelectItem>
                                        <SelectItem value="Terminé">Terminé</SelectItem>
                                        <SelectItem value="Annulé">Annulé</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de l'image de couverture</FormLabel>
                            <FormControl>
                            <Input type="url" placeholder="https://exemple.com/image.png" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Indice pour l'image (IA)</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: 'aide humanitaire'" {...field} />
                            </FormControl>
                            <FormMessage />
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
