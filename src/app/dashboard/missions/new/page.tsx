
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const missionSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  description: z.string().min(1, "La description est requise."),
  location: z.string().min(1, "Le lieu est requis."),
  startDate: z.date({ required_error: "La date de début est requise." }),
  endDate: z.date({ required_error: "La date de fin est requise." }),
  maxParticipants: z.coerce.number().int().positive("Le nombre doit être positif.").optional(),
  status: z.enum(['Planifiée', 'En cours', 'Terminée', 'Annulée']).default('Planifiée'),
  requiredSkills: z.array(z.string()).default([]),
});

type MissionFormValues = z.infer<typeof missionSchema>;

export default function NewMissionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      status: "Planifiée",
      requiredSkills: [],
    },
  });

  const onSubmit = async (data: MissionFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
      });
      if (!response.ok) {
          throw new Error('Failed to create mission');
      }

      toast({
        title: "Mission créée",
        description: "La nouvelle mission a été ajoutée avec succès.",
      });
      router.push("/dashboard/missions");
      router.refresh();
    } catch (error) {
      console.error("Error creating mission: ", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la mission.",
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
                <Link href="/dashboard/missions">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h1 className="text-3xl font-headline font-bold">Nouvelle Mission</h1>
        </div>
      
        <Card>
            <CardHeader>
                <CardTitle>Planifier une nouvelle mission</CardTitle>
                <CardDescription>Remplissez les champs ci-dessous pour créer une nouvelle mission.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre de la mission</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: Distribution de kits alimentaires" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lieu de la mission</FormLabel>
                                <FormControl>
                                <Input placeholder="Ex: Libreville, 6ème arrondissement" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxParticipants"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de participants maximum</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Ex: 25" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date de début</FormLabel>
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
                                        disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                        }
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
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date de fin</FormLabel>
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
                                        disabled={(date) =>
                                            date < (form.getValues("startDate") || new Date())
                                        }
                                        initialFocus
                                        locale={fr}
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Décrivez les objectifs et les activités de la mission." rows={5} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Création..." : "Créer la mission"}
                    </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    </div>
  );
}
