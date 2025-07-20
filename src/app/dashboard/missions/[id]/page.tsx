
"use client";

import * as React from "react";
import { doc, getDoc, collection, getDocs, query, where, documentId } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase/client";
import type { Mission } from "@/types/mission";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, MapPin, ClipboardList, Share2, PlusCircle, CheckCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

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
    const [mission, setMission] = React.useState<Mission | null>(null);
    const [participants, setParticipants] = React.useState<Volunteer[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchMissionDetails = async () => {
            if (typeof id !== 'string' || !db) return;
            setLoading(true);
            try {
                // Fetch mission data
                const missionRef = doc(db, "missions", id);
                const missionSnap = await getDoc(missionRef);

                if (!missionSnap.exists()) {
                    toast({ title: "Erreur", description: "Mission non trouvée.", variant: "destructive" });
                    router.push('/dashboard/missions');
                    return;
                }
                
                const missionData = { id: missionSnap.id, ...missionSnap.data() } as Mission;
                setMission(missionData);

                // Fetch participants data if any
                if (missionData.participants && missionData.participants.length > 0) {
                    const participantsQuery = query(collection(db, "volunteers"), where(documentId(), "in", missionData.participants));
                    const participantsSnap = await getDocs(participantsQuery);
                    const participantsData = participantsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
                    setParticipants(participantsData);
                }
            } catch (error) {
                console.error("Error fetching mission details: ", error);
                toast({ title: "Erreur", description: "Impossible de charger les détails de la mission.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        if (db) {
            fetchMissionDetails();
        }
    }, [id, router, toast]);

    if (loading) {
        return <MissionDetailSkeleton />;
    }

    if (!mission) return null;

    const participantCount = participants.length;
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
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Partager la liste
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
                                    {mission.requiredSkills.length > 0 ? 
                                        mission.requiredSkills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>) :
                                        <p className="text-muted-foreground text-xs">Aucune compétence spécifique requise.</p>
                                    }
                                 </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Participants */}
                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-headline flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Participants
                                    {mission.maxParticipants && <span className="text-base font-medium text-muted-foreground">({participantCount} / {mission.maxParticipants})</span>}
                                </CardTitle>
                                 <Button size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer un formulaire
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
                           {participants.length > 0 ? (
                                <div className="space-y-4">
                                    {participants.map(p => (
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
                                        Créez et partagez un formulaire pour inviter les volontaires à participer.
                                    </p>
                                </div>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

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
            <div className="lg:col-span-2">
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
            </div>
        </div>
    </div>
);
