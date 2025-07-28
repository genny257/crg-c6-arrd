
"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, setHours, setMinutes } from "date-fns";

const appointmentSchema = z.object({
  name: z.string().min(2, "Le nom est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  phone: z.string().optional(),
  reason: z.enum(['VOLUNTEERING_INFO', 'TRAINING_INFO', 'PARTNERSHIP', 'OTHER'], {
    required_error: "Le motif est requis.",
  }),
  details: z.string().optional(),
  scheduledAt: z.date({ required_error: "Veuillez sélectionner une date et une heure." }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00",
];

export default function RendezVousPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = setMinutes(setHours(selectedDate, hours), minutes);
      form.setValue("scheduledAt", newDate, { shouldValidate: true });
    }
  };
  
  const onSubmit: SubmitHandler<AppointmentFormValues> = async (data) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("La prise de rendez-vous a échoué.");
        }

        setIsSubmitted(true);
        form.reset();
        setSelectedDate(undefined);

    } catch (error) {
        console.error("Appointment form error:", error);
        toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    }
  };

  if (isSubmitted) {
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="flex flex-col items-center justify-center text-center p-8 max-w-lg">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="font-headline text-2xl">Rendez-vous demandé !</CardTitle>
                <CardDescription className="mt-2">
                    Votre demande a bien été enregistrée. Nous la confirmerons par e-mail dans les plus brefs délais.
                </CardDescription>
                <Button onClick={() => setIsSubmitted(false)} className="mt-6">Prendre un autre rendez-vous</Button>
            </Card>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-bold text-primary mb-2">Prendre un rendez-vous</h1>
                <p className="text-lg text-muted-foreground">
                    Planifiez une rencontre avec nos équipes pour toute question ou collaboration.
                </p>
            </div>
            <Card>
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Column: Date and Time */}
                                <div className="space-y-4">
                                     <FormField
                                        name="scheduledAt"
                                        control={form.control}
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>1. Choisissez une date</FormLabel>
                                                <FormControl>
                                                    <div className="p-3 border rounded-md">
                                                        <CalendarComponent
                                                            mode="single"
                                                            selected={selectedDate}
                                                            onSelect={setSelectedDate}
                                                            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                                                            initialFocus
                                                        />
                                                    </div>
                                                </FormControl>
                                                 <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {selectedDate && (
                                        <div>
                                            <FormLabel>2. Choisissez une heure</FormLabel>
                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                {availableTimeSlots.map(time => (
                                                    <Button
                                                        key={time}
                                                        type="button"
                                                        variant={form.watch("scheduledAt") && format(form.watch("scheduledAt"), "HH:mm") === time ? "default" : "outline"}
                                                        onClick={() => handleTimeSelect(time)}
                                                    >
                                                        {time}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Right Column: Details */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">3. Vos informations</h3>
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Nom complet</FormLabel><FormControl><Input placeholder="Votre nom" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="Votre email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>Téléphone (Optionnel)</FormLabel><FormControl><Input type="tel" placeholder="Votre numéro" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="reason" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Motif du rendez-vous</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Choisir un motif" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="VOLUNTEERING_INFO">Information sur le volontariat</SelectItem>
                                                    <SelectItem value="TRAINING_INFO">Information sur les formations</SelectItem>
                                                    <SelectItem value="PARTNERSHIP">Proposition de partenariat</SelectItem>
                                                    <SelectItem value="OTHER">Autre</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    {form.watch('reason') === 'OTHER' && (
                                        <FormField control={form.control} name="details" render={({ field }) => (
                                            <FormItem><FormLabel>Détails supplémentaires</FormLabel><FormControl><Textarea placeholder="Précisez le motif de votre demande" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Prendre rendez-vous
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </div>
  );
}
