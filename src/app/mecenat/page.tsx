
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, HandHeart, CheckCircle2 } from "lucide-react";

export default function MecenatPage() {
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
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Contactez notre équipe Partenariats</CardTitle>
                <CardDescription>Discutons ensemble d'un partenariat sur mesure. Laissez-nous vos coordonnées et nous vous recontacterons rapidement.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact-name">Nom du contact</Label>
                            <Input id="contact-name" placeholder="Prénom et Nom" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Nom de l'entreprise</Label>
                            <Input id="company-name" placeholder="Votre entreprise" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Adresse e-mail professionnelle</Label>
                        <Input id="email" type="email" placeholder="contact@entreprise.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Numéro de téléphone</Label>
                        <Input id="phone" type="tel" placeholder="Votre numéro" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Votre message</Label>
                        <Textarea id="message" placeholder="Comment aimeriez-vous nous soutenir ?" rows={4} />
                    </div>
                    <Button type="submit" className="w-full">Envoyer la demande</Button>
                </form>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
