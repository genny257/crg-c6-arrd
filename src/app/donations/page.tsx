
"use client"
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDoc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, CreditCard, Smartphone, Users, ChevronDown, Menu, X, LayoutDashboard, HeartHandshake, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";


const donationAmounts = [
    { amount: 2000, label: "2 000 FCFA", description: "Fournit un kit d'hygiène de base." },
    { amount: 5000, label: "5 000 FCFA", description: "Permet un soin de santé essentiel pour un enfant." },
    { amount: 10000, label: "10 000 FCFA", description: "Nourrit une famille pendant une semaine." },
];

export default function DonationPage() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { user, loading } = useAuth();
    const [isSuccess, setIsSuccess] = React.useState(false);

    if (isSuccess) {
        return (
             <div className="bg-background min-h-screen">
                <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} loading={loading} />
                <main className="container mx-auto px-4 py-8 md:py-16 flex items-center justify-center text-center">
                    <Card className="w-full max-w-lg p-8">
                        <CardHeader>
                            <HeartHandshake className="h-16 w-16 text-primary mx-auto mb-4" />
                            <CardTitle className="font-headline text-3xl">Merci pour votre générosité !</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Votre promesse de don a été enregistrée avec succès. Votre soutien est précieux et nous aidera à poursuivre nos actions sur le terrain. Un reçu vous sera envoyé par e-mail.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild>
                                    <Link href="/">Retour à l'accueil</Link>
                                </Button>
                                <Button variant="secondary" onClick={() => setIsSuccess(false)}>Faire un autre don</Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen">
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} loading={loading} />
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
                                        <DonationForm onFormSuccess={() => setIsSuccess(true)} isMonthly={false} />
                                    </TabsContent>
                                    <TabsContent value="monthly" className="mt-6">
                                        <DonationForm onFormSuccess={() => setIsSuccess(true)} isMonthly={true} />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <Lock className="h-4 w-4 mr-2" />
                            <span>Les transactions seront bientôt 100% sécurisées.</span>
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
                                 <Button variant="link" asChild className="p-0">
                                    <Link href="/reports">Voir nos rapports annuels</Link>
                                 </Button>
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
            <Footer />
        </div>
    );
}

const Header = ({ isMenuOpen, setIsMenuOpen, user, loading }: { isMenuOpen: boolean, setIsMenuOpen: (isOpen: boolean) => void, user: any, loading: boolean }) => (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm z-20 sticky top-0">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 40C15.16 40 8 32.84 8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24C40 32.84 32.84 40 24 40ZM26 22V12H22V22H12V26H22V36H26V26H36V22H26Z" fill="currentColor"/>
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
                    <DropdownMenuItem asChild><Link href="/blog">Blog</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/reports">Rapports</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/events">Évènements</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {!loading && user ? (
                <Button asChild variant="ghost"><Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></Button>
            ) : (
                <Button asChild variant="ghost"><Link href="/login">Connexion</Link></Button>
            )}
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
        {isMenuOpen && (
            <div className="fixed top-14 left-0 w-full md:hidden bg-background shadow-md z-50">
                <nav className="flex flex-col items-center gap-4 p-4">
                    <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                    <Link href="/team" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Équipe</Link>
                    <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    <Link href="/blog" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                    <Link href="/reports" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Rapports</Link>
                    <Link href="/events" className="text-sm font-medium hover:underline underline-offset-4" onClick={() => setIsMenuOpen(false)}>Évènements</Link>
                    <div className="flex flex-col gap-4 w-full items-center mt-4 border-t pt-4">
                        {!loading && user ? (
                            <Button asChild variant="ghost" className="w-full"><Link href="/dashboard" onClick={() => setIsMenuOpen(false)}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></Button>
                        ) : (
                            <Button asChild variant="ghost" className="w-full"><Link href="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link></Button>
                        )}
                        <Button asChild className="w-full"><Link href="/register" onClick={() => setIsMenuOpen(false)}>Devenir Volontaire</Link></Button>
                    </div>
                </nav>
            </div>
        )}
    </header>
);

const Footer = () => (
     <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-muted-foreground">&copy; 2024 Croix-Rouge Gabonaise. Tous droits réservés.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>Termes & Conditions</Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>Politique de confidentialité</Link>
        </nav>
    </footer>
);

const donationSchema = z.object({
    amount: z.coerce.number().min(1000, "Le montant minimum est de 1 000 FCFA."),
    paymentMethod: z.enum(["mobile", "card"]),
    firstName: z.string().min(1, "Le prénom est requis."),
    lastName: z.string().min(1, "Le nom est requis."),
    email: z.string().email("L'adresse e-mail n'est pas valide."),
});

const DonationForm = ({ onFormSuccess, isMonthly }: { onFormSuccess: () => void, isMonthly: boolean }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof donationSchema>>({
        resolver: zodResolver(donationSchema),
        defaultValues: {
            amount: 5000,
            paymentMethod: "mobile",
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof donationSchema>) => {
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "donations"), {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                amount: data.amount,
                type: isMonthly ? 'Mensuel' : 'Ponctuel',
                method: data.paymentMethod === 'mobile' ? 'Mobile Money' : 'Carte Bancaire',
                date: new Date().toISOString(),
                status: 'En attente',
            });
            toast({
                title: "Promesse de don enregistrée",
                description: "Merci pour votre soutien ! Nous vous contacterons bientôt.",
            });
            onFormSuccess();
        } catch (error) {
            console.error("Error creating donation: ", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue. Veuillez réessayer.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const selectedAmount = form.watch("amount");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label className="text-base font-semibold mb-2 block">Choisissez un montant</Label>
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}
                                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                    >
                                        {donationAmounts.map(({ amount, label }) => (
                                            <FormItem key={amount}>
                                                <FormControl>
                                                    <RadioGroupItem value={String(amount)} id={`amount-${amount}`} className="sr-only" />
                                                </FormControl>
                                                <Label
                                                    htmlFor={`amount-${amount}`}
                                                    className={cn(
                                                        "flex items-center justify-center p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer",
                                                        selectedAmount === amount && "border-primary"
                                                    )}
                                                >
                                                    {label}
                                                </Label>
                                            </FormItem>
                                        ))}
                                         <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="other" id="amount-other" className="sr-only" />
                                            </FormControl>
                                            <Label
                                                htmlFor="amount-other"
                                                className={cn(
                                                     "flex items-center justify-center p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer",
                                                     !donationAmounts.some(d => d.amount === selectedAmount) && "border-primary"
                                                )}
                                                onClick={() => form.setValue("amount", 0)}
                                            >
                                                Autre
                                            </Label>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage className="pt-2" />
                            </FormItem>
                        )}
                    />
                    {!donationAmounts.some(d => d.amount === selectedAmount) && (
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormControl>
                                        <Input type="number" placeholder="Montant libre (en FCFA)" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                    </FormControl>
                                     <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                             <FormLabel className="text-base font-semibold mb-2 block">Moyen de paiement</FormLabel>
                             <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="mobile" id="payment-mobile" className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor="payment-mobile" className={cn("flex items-center gap-3 p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer", field.value === 'mobile' && 'border-primary')}>
                                            <Smartphone/> Mobile Money
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="card" id="payment-card" className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor="payment-card" className={cn("flex items-center gap-3 p-4 rounded-md border-2 border-muted bg-popover hover:border-primary cursor-pointer", field.value === 'card' && 'border-primary')}>
                                            <CreditCard/> Carte Bancaire
                                        </Label>
                                    </FormItem>
                                </RadioGroup>
                             </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl><Input placeholder="Votre prénom" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl><Input placeholder="Votre nom" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adresse e-mail</FormLabel>
                                <FormControl><Input type="email" placeholder="Pour recevoir votre reçu de don" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button size="lg" className="w-full text-lg h-12" type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    JE FAIS UN DON {isMonthly ? 'MENSUEL' : ''}
                </Button>
            </form>
        </Form>
    );
};
