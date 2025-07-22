
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus2, MoreHorizontal, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Image from "next/image";
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
            const response = await fetch('http://localhost:3001/api/missions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const missionsData: Mission[] = await response.json();
            setMissions(missionsData);
        } catch (error) {
            console.error("Error fetching missions from API: ", error);
            toast({
                title: "Erreur de connexion à l'API",
                description: "Impossible de charger les missions depuis le serveur. Vérifiez que le serveur backend est démarré.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    const updateMissionStatus = async (id: string, status: 'Annulée' | 'Planifiée') => {
        if (!id) return;
        
        const originalMissions = [...missions];
        const updatedMissions = missions.map(m => m.id === id ? { ...m, status } : m);
        setMissions(updatedMissions);

        try {
             const response = await fetch(`http://localhost:3001/api/missions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (!response.ok) throw new Error("Failed to update status");

            toast({
                title: "Statut mis à jour",
                description: `Le statut de la mission a été mis à jour.`,
            });
            fetchMissions(); // Refresh the list
        } catch(error) {
             console.error("Error updating mission status: ", error);
             toast({
                title: "Erreur",
                description: "La mise à jour du statut a échoué.",
                variant: "destructive",
            });
            setMissions(originalMissions); // Revert on error
        }
    };
    
    React.useEffect(() => {
        fetchMissions();
    }, [fetchMissions]);
    
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
                                            <TableCell className="font-medium">
                                                <Link href={`/dashboard/missions/${mission.id}`} className="hover:underline">
                                                    {mission.title}
                                                </Link>
                                            </TableCell>
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
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/missions/${mission.id}`}>Voir les détails</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/missions/${mission.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
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
