
"use client"

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building, HandHeart, CheckCircle2, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const sponsorshipSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  contactName: z.string().min(1, "Le nom du contact est requis"),
  email: z.string().email("L'adresse e-mail est invalide"),
  phone: z.string().optional(),
  message: z.string().min(1, "Le message ne peut pas être vide"),
});

type SponsorshipFormValues = z.infer<typeof sponsorshipSchema>;

export default function MecenatPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<SponsorshipFormValues>({
    resolver: zodResolver(sponsorshipSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<SponsorshipFormValues> = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsorships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("La soumission a échoué.");
      }
      
      toast({
        title: "Message envoyé avec succès",
        description: "Nous vous remercions pour votre confiance. Un e-mail de confirmation vous a été envoyé.",
      });
      setIsSubmitted(true);
      form.reset();

    } catch (error) {
        console.error("Sponsorship form error:", error);
        toast({
            title: "Erreur",
            description: "Une erreur est survenue. Veuillez réessayer.",
            variant: "destructive",
        });
    }
  };


  return (
    <div className="space-y-16">
      <section className="text-center">
        <Building className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Mécénat d'Entreprise</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Engagez votre entreprise aux côtés de la Croix-Rouge Gabonaise et devenez un acteur clé du changement social et humanitaire dans notre communauté.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-bold text-center mb-8">Pourquoi devenir notre partenaire ?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
             <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <HandHeart className="h-6 w-6 text-primary" />
             </div>
             <h3 className="text-xl font-bold font-headline mb-2">Impact Direct et Local</h3>
             <p className="text-muted-foreground">Soutenez des actions concrètes qui améliorent la vie des populations vulnérables du 6ème arrondissement et au-delà.</p>
          </div>
           <div className="flex flex-col items-center">
             <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Building className="h-6 w-6 text-primary" />
             </div>
             <h3 className="text-xl font-bold font-headline mb-2">Valeurs et Image d'Entreprise</h3>
             <p className="text-muted-foreground">Associez votre marque aux principes d'humanité, d'impartialité et de solidarité de la Croix-Rouge.</p>
          </div>
           <div className="flex flex-col items-center">
             <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
             </div>
             <h3 className="text-xl font-bold font-headline mb-2">Engagement des Collaborateurs</h3>
             <p className="text-muted-foreground">Fédérez vos équipes autour d'un projet porteur de sens et renforcez la cohésion interne.</p>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
            <h2 className="text-3xl font-headline font-bold mb-4">Comment nous soutenir ?</h2>
            <ul className="space-y-4">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span><strong>Mécénat financier :</strong> Participez au financement de nos missions de secours, de nos programmes de santé ou de nos actions sociales.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span><strong>Mécénat de compétences :</strong> Mettez l'expertise de vos collaborateurs au service de nos projets (logistique, communication, IT, etc.).</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span><strong>Don en nature :</strong> Fourniture de matériel (médical, logistique, bureautique), de denrées alimentaires ou de produits de première nécessité.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span><strong>Arrondi sur salaire :</strong> Proposez à vos employés de faire des micro-dons directement depuis leur salaire.</span>
                </li>
            </ul>
        </div>
         {isSubmitted ? (
            <Card className="flex flex-col items-center justify-center text-center p-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="font-headline text-2xl">Demande envoyée !</CardTitle>
                <CardDescription className="mt-2">Merci pour votre intérêt. Notre équipe vous recontactera dans les plus brefs délais.</CardDescription>
                <Button onClick={() => setIsSubmitted(false)} className="mt-6">Faire une autre demande</Button>
            </Card>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Contactez notre équipe Partenariats</CardTitle>
                    <CardDescription>Discutons ensemble d'un partenariat sur mesure. Laissez-nous vos coordonnées et nous vous recontacterons rapidement.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="contactName" render={({ field }) => (
                                    <FormItem><FormLabel>Nom du contact</FormLabel><FormControl><Input placeholder="Prénom et Nom" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="companyName" render={({ field }) => (
                                    <FormItem><FormLabel>Nom de l'entreprise</FormLabel><FormControl><Input placeholder="Votre entreprise" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Adresse e-mail professionnelle</FormLabel><FormControl><Input type="email" placeholder="contact@entreprise.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Numéro de téléphone</FormLabel><FormControl><Input type="tel" placeholder="Votre numéro (optionnel)" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="message" render={({ field }) => (
                                <FormItem><FormLabel>Votre message</FormLabel><FormControl><Textarea placeholder="Comment aimeriez-vous nous soutenir ?" rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Envoyer la demande
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        )}
      </section>
    </div>
  );
}
