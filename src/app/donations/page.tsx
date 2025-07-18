
"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, CreditCard, Smartphone, Banknote, HeartHandshake, Link as LinkIcon, Users, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const donationAmounts = [
    { amount: 2000, label: "2 000 FCFA", description: "Fournit un kit d'hygiène de base." },
    { amount: 5000, label: "5 000 FCFA", description: "Permet un soin de santé essentiel pour un enfant." },
    { amount: 10000, label: "10 000 FCFA", description: "Nourrit une famille pendant une semaine." },
];

export default function DonationPage() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="bg-background min-h-screen">
             <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm z-20 sticky top-0">
                <Link href="/" className="flex items-center justify-center" prefetch={false}>
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary"
                >
                    <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40ZM26 22V12H22V22H12V26H22V36H26V26H36V22H26Z"
                    fill="currentColor"
                    />
                </svg>
                <span className="sr-only">Croix-Rouge Gabonaise</span>
                </Link>
                <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
                    <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Accueil</Link>
                    <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4">Équipe</Link>
                    <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-sm font-medium hover:underline underline-offset-4 px-0">
                            Média <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                            <Link href="/dashboard/media/blog">Blog</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                            <Link href="/dashboard/media/reports">Rapports</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="#">Évènements Avenir</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button asChild variant="ghost">
                        <Link href="/login">Connexion</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Devenir Volontaire</Link>
                    </Button>
                </nav>
                <div className="ml-auto md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        <span className="sr-only">Ouvrir le menu</span>
                    </Button>
                </div>
            </header>
            
            {isMenuOpen && (
                <div className="md:hidden bg-background shadow-md absolute top-14 left-0 w-full z-50">
                    <nav className="flex flex-col items-center gap-4 p-4">
                        <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                        <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Équipe</Link>
                        <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                        <Link href="/dashboard/media/blog" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                        <Link href="/dashboard/media/reports" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Rapports</Link>
                        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Évènements Avenir</Link>
                        <div className="flex flex-col gap-4 w-full items-center mt-4 border-t pt-4">
                            <Button asChild variant="ghost" className="w-full">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link href="/register" onClick={() => setIsMenuOpen(false)}>Devenir Volontaire</Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}

            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                             <h1 className="text-4xl font-headline font-bold text-primary mb-2">Faites un don. Sauvez des vies.</h1>
                             <p className="text-lg text-muted-foreground">Votre contribution soutient nos actions humanitaires au Gabon.</p>
                        </div>
                       
                        <Card>
                            <CardContent className="p-6">
                                <Tabs defaultValue="onetime">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="onetime">Don ponctuel</TabsTrigger>
                                        <TabsTrigger value="monthly">Don mensuel</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="onetime" className="mt-6">
                                        <DonationForm />
                                    </TabsContent>
                                    <TabsContent value="monthly" className="mt-6">
                                        <DonationForm isMonthly />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <Lock className="h-4 w-4 mr-2" />
                            <span>Paiement 100% sécurisé. Vos informations sont confidentielles.</span>
                        </div>
                    </div>
                    
                    <aside className="space-y-8">
                         <Card className="bg-muted/30 border-primary/20">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">À quoi serviront vos dons ?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>Grâce à votre générosité, nous pouvons fournir une aide vitale : soins médicaux, nourriture pour les familles, abris d'urgence et soutien psychosocial aux plus vulnérables.</p>
                                <div className="space-y-2">
                                    {donationAmounts.map(item => (
                                         <p key={item.amount} className="text-sm">
                                            <strong className="text-primary">{item.label}</strong> : {item.description}
                                        </p>
                                    ))}
                                </div>
                            </CardContent>
                             <CardFooter>
                                 <Button variant="link" className="p-0">Voir nos rapports annuels</Button>
                             </CardFooter>
                         </Card>
                         <Card>
                             <CardHeader>
                                 <CardTitle className="font-headline text-xl">Autres façons de nous soutenir</CardTitle>
                             </CardHeader>
                             <CardContent className="grid gap-4">
                                <Link href="/register" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                                    <Users className="h-6 w-6 text-primary"/>
                                    <div>
                                        <p className="font-semibold">Devenir volontaire</p>
                                        <p className="text-sm text-muted-foreground">Rejoignez nos équipes sur le terrain.</p>
                                    </div>
                                </Link>
                                <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                                    <HeartHandshake className="h-6 w-6 text-primary"/>
                                    <div>
                                        <p className="font-semibold">Mécénat d'entreprise</p>
                                        <p className="text-sm text-muted-foreground">Engagez votre entreprise à nos côtés.</p>
                                    </div>
                                </Link>
                             </CardContent>
                         </Card>
                    </aside>
                </div>
            </main>
        </div>
    );
}

const DonationForm = ({ isMonthly = false }: { isMonthly?: boolean }) => (
    <div className="space-y-6">
        <div>
            <Label className="text-base font-semibold mb-2 block">Choisissez un montant</Label>
            <RadioGroup defaultValue="5000" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {donationAmounts.map(({ amount, label }) => (
                    <div key={amount}>
                        <RadioGroupItem value={String(amount)} id={`amount-${amount}`} className="sr-only" />
                        <Label
                            htmlFor={`amount-${amount}`}
                            className="flex items-center justify-center p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary"
                        >
                            {label}
                        </Label>
                    </div>
                ))}
                <div>
                     <RadioGroupItem value="other" id="amount-other" className="sr-only" />
                      <Label
                            htmlFor="amount-other"
                            className="flex items-center justify-center p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary"
                        >
                           Autre
                        </Label>
                </div>
            </RadioGroup>
             <Input type="number" placeholder="Montant libre" className="mt-4" />
        </div>
        <div>
            <Label className="text-base font-semibold mb-2 block">Moyen de paiement</Label>
             <RadioGroup defaultValue="mobile" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div >
                    <RadioGroupItem value="mobile" id="payment-mobile" className="sr-only" />
                    <Label htmlFor="payment-mobile" className="flex items-center gap-3 p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <Smartphone/> Mobile Money
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="card" id="payment-card" className="sr-only" />
                    <Label htmlFor="payment-card" className="flex items-center gap-3 p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <CreditCard/> Carte Bancaire
                    </Label>
                </div>
             </RadioGroup>
        </div>
         <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Votre prénom" />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Votre nom" />
                </div>
            </div>
             <div className="grid gap-1.5">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" placeholder="Pour recevoir votre reçu de don" />
            </div>
        </div>
        <Button size="lg" className="w-full text-lg h-12">
            JE FAIS UN DON {isMonthly ? 'MENSUEL' : ''}
        </Button>
    </div>
);
