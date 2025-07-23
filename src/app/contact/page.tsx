
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
            Une question ? Une suggestion ? N&apos;hésitez pas à nous écrire.
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
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127674.3942398939!2d9.38555845183416!3d0.4132068875283917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x107f43393116a907%3A0x86134b815663765!2sLibreville%2C%20Gabon!5e0!3m2!1sfr!2sfr!4v1720524453612!5m2!1sfr!2sfr"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                    ></iframe>
                </div>
            </CardContent>
        </Card>
      </aside>
    </div>
  );
}
