
"use client"
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, Users, HeartHandshake, Loader2, Building } from "lucide-react";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PublicLayout } from "@/components/public-layout";

const donationAmounts = [
    { amount: 2000, label: "2 000 FCFA", description: "Fournit un kit d'hygiène de base." },
    { amount: 5000, label: "5 000 FCFA", description: "Permet un soin de santé essentiel pour un enfant." },
    { amount: 10000, label: "10 000 FCFA", description: "Nourrit une famille pendant une semaine." },
];

const donationSchema = z.object({
    amount: z.coerce.number().min(1000, "Le montant minimum est de 1 000 FCFA."),
    firstName: z.string().min(1, "Le prénom est requis."),
    lastName: z.string().min(1, "Le nom est requis."),
    email: z.string().email("L'adresse e-mail n'est pas valide."),
    type: z.enum(['Ponctuel', 'Mensuel']).default('Ponctuel'),
});

type FormValues = z.infer<typeof donationSchema>;

export default function DonationPage() {
    const [isSuccess, setIsSuccess] = React.useState(false);

    if (isSuccess) {
        return (
             <PublicLayout>
                <main className="container mx-auto px-4 py-8 md:py-16 flex items-center justify-center text-center">
                    <Card className="w-full max-w-lg p-8">
                        <CardHeader>
                            <HeartHandshake className="h-16 w-16 text-primary mx-auto mb-4" />
                            <CardTitle className="font-headline text-3xl">Merci pour votre générosité !</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Votre promesse de don a été enregistrée avec succès. Vous recevrez des instructions par e-mail pour finaliser votre contribution par Mobile Money.
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
            </PublicLayout>
        )
    }

    return (
        <PublicLayout>
            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div>
                             <h1 className="text-4xl font-headline font-bold text-primary mb-2">Faites un don. Sauvez des vies.</h1>
                             <p className="text-lg text-muted-foreground">Votre contribution soutient nos actions humanitaires au Gabon.</p>
                        </div>
                       
                        <Card>
                            <CardContent className="p-6">
                                <DonationForm onFormSuccess={() => setIsSuccess(true)} />
                            </CardContent>
                        </Card>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <Lock className="h-4 w-4 mr-2" />
                            <span>Votre contribution est essentielle et sécurisée.</span>
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
                                <Link href="/mecenat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                                    <Building className="h-6 w-6 text-primary"/>
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
        </PublicLayout>
    );
}

const DonationForm = ({ onFormSuccess }: { onFormSuccess: () => void }) => {
    const { toast } = useToast();
    const form = useForm<FormValues>({
        resolver: zodResolver(donationSchema),
        defaultValues: {
            amount: 5000,
            firstName: "",
            lastName: "",
            email: "",
            type: 'Ponctuel',
        },
    });

    const handleDonationSubmit = async (data: FormValues) => {
        try {
            const donationPayload = {
                ...data,
                name: `${data.firstName} ${data.lastName}`,
                method: 'Mobile_Money', // Only Mobile Money is supported now
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donationPayload),
            });

            if (!response.ok) {
                throw new Error("Impossible d'enregistrer la promesse de don.");
            }

            toast({
                title: "Promesse enregistrée !",
                description: "Merci ! Vous recevrez bientôt les instructions pour finaliser votre don.",
            });
            onFormSuccess();

        } catch (error) {
            console.error("Error creating donation record:", error);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'enregistrement de votre promesse de don.",
                variant: "destructive",
            });
        }
    };
    
    const selectedAmount = form.watch("amount");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDonationSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                            >
                                <FormItem>
                                    <FormControl>
                                        <RadioGroupItem value="Ponctuel" id="onetime" className="sr-only" />
                                    </FormControl>
                                    <Label htmlFor="onetime" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'Ponctuel' && 'border-primary')}>Don ponctuel</Label>
                                </FormItem>
                                <FormItem>
                                     <FormControl>
                                        <RadioGroupItem value="Mensuel" id="monthly" className="sr-only" />
                                    </FormControl>
                                    <Label htmlFor="monthly" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === 'Mensuel' && 'border-primary')}>Don mensuel</Label>
                                </FormItem>
                            </RadioGroup>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                     {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Je fais un don
                </Button>
            </form>
        </Form>
    )
}
