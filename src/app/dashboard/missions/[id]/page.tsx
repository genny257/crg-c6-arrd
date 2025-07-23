
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Mission } from "@/types/mission";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, MapPin, ClipboardList, Share2, PlusCircle, CheckCircle, Edit, Sparkles, Wand2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'En cours': return 'default';
        case 'Planifiée': return 'secondary';
        case 'Terminée': return 'outline';
        case 'Annulée': return 'destructive';
        default: return 'secondary';
    }
};

export default function MissionDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { token } = useAuth();
    const [mission, setMission] = React.useState<Mission | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchMissionDetails = async () => {
            if (typeof id !== 'string' || !token) return;
            setLoading(true);
            try {
                const missionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!missionResponse.ok) {
                    throw new Error('Mission not found');
                }
                
                const missionData: Mission = await missionResponse.json();
                setMission(missionData);

            } catch (error) {
                console.error("Error fetching mission details: ", error);
                toast({ title: "Erreur", description: "Impossible de charger les détails de la mission.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchMissionDetails();
        }
    }, [id, router, toast, token]);

    if (loading) {
        return <MissionDetailSkeleton />;
    }

    if (!mission) return null;

    const participantCount = mission.participants?.length || 0;
    const maxParticipants = mission.maxParticipants ?? 0;
    const progressValue = maxParticipants > 0 ? (participantCount / maxParticipants) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/missions">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold font-headline flex-1 truncate">
                    {mission.title}
                </h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                         <Link href={`/dashboard/missions/${mission.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/missions/${mission.id}`} target="_blank">
                           <Share2 className="mr-2 h-4 w-4" />
                           Partager
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - Mission Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-headline flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-primary" />
                                Informations sur la Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Badge variant={getStatusBadgeVariant(mission.status)}>{mission.status}</Badge>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <strong className="block">Période</strong>
                                    <span>{format(new Date(mission.startDate), "d MMMM yyyy", { locale: fr })} - {format(new Date(mission.endDate), "d MMMM yyyy", { locale: fr })}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <strong className="block">Lieu</strong>
                                    <span>{mission.location}</span>
                                </div>
                            </div>
                             <div className="pt-2">
                                <strong className="block mb-1">Description</strong>
                                <p className="text-muted-foreground">{mission.description}</p>
                            </div>
                             <div className="pt-2">
                                <strong className="block mb-2">Compétences Requises</strong>
                                 <div className="flex flex-wrap gap-2">
                                    {(mission.requiredSkills && mission.requiredSkills.length > 0) ? 
                                        mission.requiredSkills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>) :
                                        <p className="text-muted-foreground text-xs">Aucune compétence spécifique requise.</p>
                                    }
                                 </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Participants */}
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-headline flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Participants
                                    {mission.maxParticipants && <span className="text-base font-medium text-muted-foreground">({participantCount} / {mission.maxParticipants})</span>}
                                </CardTitle>
                                 <Button size="sm" asChild>
                                    <Link href={`/missions/${mission.id}`} target="_blank">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Ouvrir le formulaire
                                    </Link>
                                </Button>
                            </div>
                             <CardDescription>Liste des volontaires ayant confirmé leur participation.</CardDescription>
                             {mission.maxParticipants && (
                                <div className="mt-4">
                                    <Progress value={progressValue} aria-label={`${progressValue}% des places prises`}/>
                                </div>
                             )}
                        </CardHeader>
                        <CardContent>
                           {(mission.participants && mission.participants.length > 0) ? (
                                <div className="space-y-4">
                                    {mission.participants.map((p: any) => (
                                         <div key={p.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                                            <Avatar>
                                                <AvatarImage src={p.photo} />
                                                <AvatarFallback>{p.firstName?.[0]}{p.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium">{p.firstName} {p.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{p.email}</p>
                                            </div>
                                            <Badge variant="outline">Confirmé</Badge>
                                        </div>
                                    ))}
                                </div>
                           ) : (
                                <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">Aucun participant pour le moment</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Partagez le formulaire public pour inviter les volontaires à participer.
                                    </p>
                                </div>
                           )}
                        </CardContent>
                    </Card>
                    <VolunteerSuggestions missionId={mission.id} />
                </div>
            </div>
        </div>
    );
}

const VolunteerSuggestions = ({ missionId }: { missionId: string }) => {
    const { token } = useAuth();
    const [suggestions, setSuggestions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();

    const handleSuggest = async () => {
        if (!token) return;
        setLoading(true);
        setSuggestions([]);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/missions/${missionId}/suggest-volunteers`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to get suggestions');
            }
            const data = await response.json();
            setSuggestions(data.recommendations);
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message || "Impossible de générer les suggestions.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-headline flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Suggestions IA
                    </CardTitle>
                    <Button onClick={handleSuggest} disabled={loading} size="sm">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Suggérer des volontaires
                    </Button>
                </div>
                <CardDescription>Laissez l&apos;IA vous proposer les meilleurs profils pour cette mission.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                )}
                {suggestions.length > 0 && (
                     <div className="space-y-4">
                        {suggestions.map((s, i) => (
                             <div key={i} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-bold">{s.volunteerName}</p>
                                    <p className="text-sm text-muted-foreground italic">&quot;{s.justification}&quot;</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-sm font-semibold">Score</p>
                                     <Badge>{(s.matchScore * 100).toFixed(0)}%</Badge>
                                </div>
                                <Button size="sm" variant="outline">Contacter</Button>
                            </div>
                        ))}
                    </div>
                )}
                 {!loading && suggestions.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground py-4">Cliquez sur le bouton pour générer des suggestions.</p>
                 )}
            </CardContent>
        </Card>
    );
};

const MissionDetailSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-1/2" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-9 w-40" />
                        </div>
                         <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="text-center py-12">
                         <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                         <Skeleton className="h-6 w-48 mx-auto mt-4" />
                         <Skeleton className="h-4 w-64 mx-auto mt-2" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                             <Skeleton className="h-6 w-1/2" />
                             <Skeleton className="h-9 w-44" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="text-center py-8">
                         <Skeleton className="h-4 w-3/4 mx-auto" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);
