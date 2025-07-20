
"use client";

import * as React from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, HeartHandshake, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { db } from "@/lib/firebase/client";
import type { Volunteer } from "@/types/volunteer";
import type { Mission } from "@/types/mission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Actif': case 'En cours': return 'default';
        case 'En attente': case 'Planifiée': return 'secondary';
        case 'Rejeté': case 'Annulée': return 'destructive';
        default: return 'outline';
    }
};

export default function DashboardPage() {
    const [stats, setStats] = React.useState({ volunteers: 0, missions: 0, donations: 0 });
    const [pendingVolunteers, setPendingVolunteers] = React.useState<Volunteer[]>([]);
    const [upcomingMissions, setUpcomingMissions] = React.useState<Mission[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            if (!db) return;
            setLoading(true);
            try {
                // Fetch stats
                const volunteersSnap = await getDocs(collection(db, "volunteers"));
                const missionsSnap = await getDocs(query(collection(db, "missions"), where("status", "==", "En cours")));
                const donationsSnap = await getDocs(collection(db, "donations"));
                setStats({ volunteers: volunteersSnap.size, missions: missionsSnap.size, donations: donationsSnap.size });

                // Fetch pending volunteers
                const pendingQ = query(collection(db, "volunteers"), where("status", "==", "En attente"), orderBy("createdAt", "desc"), limit(5));
                const pendingSnap = await getDocs(pendingQ);
                setPendingVolunteers(pendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer)));

                // Fetch upcoming missions
                const upcomingQ = query(collection(db, "missions"), where("status", "in", ["Planifiée", "En cours"]), orderBy("startDate", "asc"), limit(5));
                const upcomingSnap = await getDocs(upcomingQ);
                setUpcomingMissions(upcomingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission)));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold">Tableau de bord</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total des Volontaires</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.volunteers}</div>}
                        <p className="text-xs text-muted-foreground">Membres actifs et en attente</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Missions en Cours</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.missions}</div>}
                        <p className="text-xs text-muted-foreground">Missions actives sur le terrain</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total des Dons</CardTitle>
                        <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.donations}</div>}
                        <p className="text-xs text-muted-foreground">Contributions enregistrées</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Candidatures Récentes</CardTitle>
                        <CardDescription>Les derniers volontaires en attente d'approbation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
                                pendingVolunteers.length > 0 ? (
                                    pendingVolunteers.map(v => (
                                        <div key={v.id} className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={v.photo} />
                                                <AvatarFallback>{v.firstName?.[0]}{v.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium">{v.firstName} {v.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{v.email}</p>
                                            </div>
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/dashboard/volunteers/${v.id}`}>Voir</Link>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">Aucune nouvelle candidature.</p>
                                )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/dashboard/volunteers?status=En+attente">
                                Voir toutes les candidatures <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Missions à Venir</CardTitle>
                        <CardDescription>Les prochaines missions planifiées et en cours.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                             {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
                                upcomingMissions.length > 0 ? (
                                    upcomingMissions.map(m => (
                                        <div key={m.id} className="flex items-center gap-4">
                                            <div className="p-2 bg-muted rounded-md">
                                                <Briefcase className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{m.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(m.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} - <Badge variant={getStatusBadgeVariant(m.status)}>{m.status}</Badge>
                                                </p>
                                            </div>
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/dashboard/missions/${m.id}`}>Détails</Link>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                     <p className="text-sm text-muted-foreground text-center py-4">Aucune mission à venir.</p>
                                )}
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/dashboard/missions">
                                Voir toutes les missions <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
