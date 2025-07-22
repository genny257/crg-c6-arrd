
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, Users, HeartHandshake, Loader2, Building } from "lucide-react";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PublicLayout } from "@/components/public-layout";

import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');


const donationAmounts = [
    { amount: 2000, label: "2 000 FCFA", description: "Fournit un kit d'hygiène de base." },
    { amount: 5000, label: "5 000 FCFA", description: "Permet un soin de santé essentiel pour un enfant." },
    { amount: 10000, label: "10 000 FCFA", description: "Nourrit une famille pendant une semaine." },
];

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
                                Votre don a été traité avec succès. Votre soutien est précieux et nous aidera à poursuivre nos actions sur le terrain. Un reçu vous a été envoyé par e-mail.
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
                                <Tabs defaultValue="onetime">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="onetime">Don ponctuel</TabsTrigger>
                                        <TabsTrigger value="monthly">Don mensuel</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="onetime" className="mt-6">
                                        <StripeDonationForm onFormSuccess={() => setIsSuccess(true)} isMonthly={false} />
                                    </TabsContent>
                                    <TabsContent value="monthly" className="mt-6">
                                        <StripeDonationForm onFormSuccess={() => setIsSuccess(true)} isMonthly={true} />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <Lock className="h-4 w-4 mr-2" />
                            <span>Transactions 100% sécurisées via Stripe.</span>
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

const donationSchema = z.object({
    amount: z.coerce.number().min(1000, "Le montant minimum est de 1 000 FCFA."),
    firstName: z.string().min(1, "Le prénom est requis."),
    lastName: z.string().min(1, "Le nom est requis."),
    email: z.string().email("L'adresse e-mail n'est pas valide."),
});


const StripeDonationForm = ({ onFormSuccess, isMonthly }: { onFormSuccess: () => void, isMonthly: boolean }) => {
    const [clientSecret, setClientSecret] = React.useState<string | null>(null);
    const [donationData, setDonationData] = React.useState<any>(null);

    const form = useForm<z.infer<typeof donationSchema>>({
        resolver: zodResolver(donationSchema),
        defaultValues: {
            amount: 5000,
            firstName: "",
            lastName: "",
            email: "",
        },
    });
    
    const amount = form.watch("amount");

    React.useEffect(() => {
        // Create a new Payment Intent whenever the amount changes
        if (amount >= 1000) {
            const data = {
                ...form.getValues(),
                name: `${form.getValues().firstName} ${form.getValues().lastName}`,
                type: isMonthly ? 'Mensuel' : 'Ponctuel',
                method: 'Carte_Bancaire',
            };
            setDonationData(data);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
        }
    }, [amount, form, isMonthly]);

    return (
        <div>
            {!clientSecret ? (
                <DonationDetailsForm form={form} />
            ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm onFormSuccess={onFormSuccess} />
                </Elements>
            )}
        </div>
    );
}

const DonationDetailsForm = ({ form }: { form: any }) => {
    const selectedAmount = form.watch("amount");
    return (
        <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
                 <p className="text-sm text-muted-foreground text-center">Remplissez vos informations pour continuer vers le paiement.</p>
            </form>
        </Form>
    )
}


const CheckoutForm = ({ onFormSuccess }: { onFormSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donations`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({ title: "Erreur de paiement", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Paiement réussi!", description: "Votre don a été accepté. Merci !" });
      onFormSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button disabled={isProcessing || !stripe || !elements} className="w-full text-lg h-12" type="submit">
            {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Payer maintenant"}
        </Button>
    </form>
  );
};
