
"use client";

import * as React from "react";
import { useParams, notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Mission } from "@/types/mission";
import { PublicLayout } from "@/components/public-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ClipboardList, BadgeInfo, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { registerToMission } from "@/ai/flows/register-to-mission-flow";

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'En cours': return 'default';
        case 'Planifiée': return 'secondary';
        case 'Terminée': return 'outline';
        case 'Annulée': return 'destructive';
        default: return 'secondary';
    }
};

export default function PublicMissionPage() {
    const { id } = useParams();
    const { toast } = useToast();
    const [mission, setMission] = React.useState<Mission | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [matricule, setMatricule] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [registrationResult, setRegistrationResult] = React.useState<{success: boolean, message: string} | null>(null);

    React.useEffect(() => {
        const fetchMission = async () => {
            if (typeof id !== 'string') return;
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions/${id}`);
                 if (!response.ok) {
                    throw new Error('Mission not found');
                }
                const missionData: Mission = await response.json();

                if (missionData.status !== "Planifiée" && missionData.status !== "En cours") {
                    notFound();
                    return;
                }
                setMission(missionData);

            } catch (error) {
                console.error("Error fetching mission: ", error);
                toast({ title: "Erreur", description: "Impossible de charger la mission.", variant: "destructive" });
                 notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchMission();
    }, [id, toast]);

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!matricule.trim() || !mission) return;
        
        setIsSubmitting(true);
        setRegistrationResult(null);

        try {
            const result = await registerToMission({ missionId: mission.id, matricule });
            setRegistrationResult(result);
            if (result.success) {
                setMatricule("");
                // Refresh mission data to update participant count
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions/${id}`);
                const updatedMission = await response.json();
                setMission(updatedMission);
            }
        } catch (error) {
            console.error("Registration error:", error);
             setRegistrationResult({ success: false, message: "Une erreur inattendue est survenue. Veuillez réessayer." });
        } finally {
            setIsSubmitting(false);
        }
    }


    if (loading) {
        return (
             <PublicLayout>
                <main className="container mx-auto px-4 py-8 md:py-16">
                    <MissionPageSkeleton />
                </main>
            </PublicLayout>
        )
    }

    if (!mission) {
        return notFound();
    }

    const participantCount = mission.participants?.length ?? 0;
    const maxParticipants = mission.maxParticipants ?? 0;

    return (
        <PublicLayout>
            <main className="container mx-auto px-4 py-8 md:py-16">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <header>
                             <Badge variant={getStatusBadgeVariant(mission.status)}>{mission.status}</Badge>
                             <h1 className="text-4xl font-headline font-bold text-primary mt-2">{mission.title}</h1>
                        </header>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-headline flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-primary" />
                                    Détails de la mission
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <strong className="block">Période</strong>
                                        <span className="text-muted-foreground">{format(new Date(mission.startDate), "d MMMM yyyy", { locale: fr })} au {format(new Date(mission.endDate), "d MMMM yyyy", { locale: fr })}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <strong className="block">Lieu</strong>
                                        <span className="text-muted-foreground">{mission.location}</span>
                                    </div>
                                </div>
                                 <div>
                                    <strong className="block mb-1">Description</strong>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{mission.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-headline flex items-center gap-2">
                                    <BadgeInfo className="h-5 w-5 text-primary" />
                                    Informations importantes
                                </CardTitle>
                            </CardHeader>
                             <CardContent>
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Compétences Requises</h4>
                                    {mission.requiredSkills && mission.requiredSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {mission.requiredSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Aucune compétence spécifique requise pour cette mission.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                     <aside className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">Participer à la mission</CardTitle>
                                {maxParticipants > 0 && (
                                    <CardDescription>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Users className="h-4 w-4" />
                                            <span>{participantCount} / {maxParticipants} participants</span>
                                        </div>
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <form onSubmit={handleRegistration}>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="matricule">Votre matricule de volontaire</Label>
                                        <Input 
                                            id="matricule" 
                                            placeholder="Ex: C6ARR-12345"
                                            value={matricule}
                                            onChange={(e) => setMatricule(e.target.value.toUpperCase())}
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </div>
                                    {registrationResult && (
                                        <Alert variant={registrationResult.success ? "default" : "destructive"} className="mt-4">
                                            <AlertTitle>{registrationResult.success ? "Succès" : "Erreur"}</AlertTitle>
                                            <AlertDescription>
                                                {registrationResult.message}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isSubmitting || (maxParticipants > 0 && participantCount >= maxParticipants)}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        { (maxParticipants > 0 && participantCount >= maxParticipants) ? "Mission complète" : "Je m'inscris" }
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </aside>
                </div>
            </main>
        </PublicLayout>
    );
}

const MissionPageSkeleton = () => (
    <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <header>
                <Skeleton className="h-6 w-24 mb-2 rounded-full" />
                <Skeleton className="h-10 w-3/4" />
            </header>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        </div>
        <aside className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                </CardHeader>
                <CardContent>
                     <Skeleton className="h-10 w-full" />
                </CardContent>
                 <CardFooter>
                     <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        </aside>
    </div>
);
