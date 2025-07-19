
"use client";

import * as React from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { db } from "@/lib/firebase/client";
import { useToast } from "@/hooks/use-toast";
import type { Mission } from "@/types/mission";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'En cours': return 'default';
        case 'Planifiée': return 'secondary';
        case 'Terminée': return 'outline';
        case 'Annulée': return 'destructive';
        default: return 'secondary';
    }
};

export default function MissionsPage() {
    const [missions, setMissions] = React.useState<Mission[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const fetchMissions = React.useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "missions"), orderBy("startDate", "desc"));
            const querySnapshot = await getDocs(q);
            const missionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
            setMissions(missionsData);
        } catch (error) {
            console.error("Error fetching missions: ", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les missions.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchMissions();
    }, [fetchMissions]);

    const updateMissionStatus = async (id: string, status: 'Annulée' | 'Planifiée') => {
        if (!id) return;
        try {
            const missionRef = doc(db, "missions", id);
            await updateDoc(missionRef, { status: status });
            setMissions(missions.map(m => m.id === id ? { ...m, status } : m));
            toast({
                title: "Statut mis à jour",
                description: `La mission a été marquée comme ${status.toLowerCase()}.`,
            });
        } catch (error) {
            console.error("Error updating mission status: ", error);
            toast({
                title: "Erreur",
                description: "Le statut de la mission n'a pas pu être modifié.",
                variant: "destructive",
            });
        }
    };
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Gestion des Missions</h1>
                <Button asChild>
                    <Link href="/dashboard/missions/new">
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        Créer une Mission
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Liste des Missions</CardTitle>
                        <CardDescription>Consultez et gérez toutes les missions en cours et à venir.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titre</TableHead>
                                    <TableHead className="hidden md:table-cell">Lieu</TableHead>
                                    <TableHead className="hidden lg:table-cell">Début</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    missions.map((mission) => (
                                        <TableRow key={mission.id}>
                                            <TableCell className="font-medium">{mission.title}</TableCell>
                                            <TableCell className="hidden md:table-cell">{mission.location}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {format(new Date(mission.startDate), "d MMM yyyy", { locale: fr })}
                                            </TableCell>
                                            <TableCell><Badge variant={getStatusBadgeVariant(mission.status)}>{mission.status}</Badge></TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Ouvrir le menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Voir</DropdownMenuItem>
                                                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                                                        <DropdownMenuItem>Assigner des volontaires</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {mission.status !== 'Annulée' ? (
                                                            <DropdownMenuItem className="text-destructive" onClick={() => updateMissionStatus(mission.id, 'Annulée')}>
                                                                Annuler
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => updateMissionStatus(mission.id, 'Planifiée')}>
                                                                Réactiver
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Carte des Missions</CardTitle>
                        <CardDescription>Visualisation géographique des missions actives.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Image
                            src="https://placehold.co/600x400.png"
                            width={600}
                            height={400}
                            alt="Map of missions"
                            data-ai-hint="Gabon map"
                            className="w-full h-auto rounded-lg"
                         />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

