
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary mb-2">Contactez-nous</h1>
          <p className="text-lg text-muted-foreground">
            Une question ? Une suggestion ? N'hésitez pas à nous écrire.
          </p>
        </div>
        <Card>
            <CardContent className="p-6">
                 <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" placeholder="Votre nom complet" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse e-mail</Label>
                            <Input id="email" type="email" placeholder="nom@exemple.com" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Sujet</Label>
                        <Input id="subject" placeholder="Sujet de votre message" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Écrivez votre message ici..." rows={5} />
                    </div>
                    <Button type="submit" className="w-full">Envoyer le message</Button>
                </form>
            </CardContent>
        </Card>
      </div>
      <aside className="space-y-8">
        <Card className="bg-muted/30 border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Nos Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">Adresse</h4>
                        <p className="text-muted-foreground">Comité du 6ème Arrondissement, Libreville, Gabon</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">Téléphone</h4>
                        <p className="text-muted-foreground">(+241) 01 23 45 67</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                        <h4 className="font-semibold">Email</h4>
                        <p className="text-muted-foreground">contact@croixrouge-gabon.org</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Localisation</CardTitle>
            </CardHeader>
            <CardContent>
                <Image
                    src="https://placehold.co/600x400.png"
                    width={600}
                    height={400}
                    alt="Map of Libreville"
                    data-ai-hint="Libreville Gabon map"
                    className="w-full h-auto rounded-lg"
                 />
            </CardContent>
        </Card>
      </aside>
    </div>
  );
}
