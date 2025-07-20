
"use client";

import * as React from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, Search, ArrowDownUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase/client";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Actif': return 'default';
        case 'En attente': return 'secondary';
        case 'Inactif': return 'outline';
        case 'Rejeté': return 'destructive';
        default: return 'secondary';
    }
};

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = React.useState<Volunteer[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{ key: 'createdAt' | 'lastName'; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });


    const fetchVolunteers = React.useCallback(async () => {
        setLoading(true);
        try {
            // Initial fetch is always ordered by creation date
            const q = query(collection(db, "volunteers"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const volunteersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
            setVolunteers(volunteersData);
        } catch (error) {
            console.error("Error fetching volunteers: ", error);
             toast({
                title: "Erreur",
                description: "Impossible de charger les volontaires.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchVolunteers();
    }, [fetchVolunteers]);

    const filteredAndSortedVolunteers = React.useMemo(() => {
        let sortedVolunteers = [...volunteers];
    
        if (searchTerm) {
          sortedVolunteers = sortedVolunteers.filter(v => 
            `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
    
        sortedVolunteers.sort((a, b) => {
          if (sortConfig.key === 'lastName') {
            const nameA = a.lastName.toLowerCase();
            const nameB = b.lastName.toLowerCase();
            if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
          } else { // createdAt
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
          }
        });
    
        return sortedVolunteers;
      }, [volunteers, searchTerm, sortConfig]);

    const updateVolunteerStatus = async (id: string, status: 'Actif' | 'Rejeté' | 'Inactif' | 'En attente') => {
        try {
            const volunteerRef = doc(db, "volunteers", id);
            await updateDoc(volunteerRef, { status: status });
            setVolunteers(volunteers.map(v => v.id === id ? { ...v, status } : v));
            toast({
                title: "Statut mis à jour",
                description: `Le statut du volontaire a été modifié.`,
            });
        } catch (error) {
            console.error("Error updating volunteer status: ", error);
            toast({
                title: "Erreur de mise à jour",
                description: "Le statut du volontaire n'a pas pu être modifié.",
                variant: "destructive",
            });
        }
    };


    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Gestion des Volontaires</h1>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Ajouter un Volontaire
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Volontaires</CardTitle>
                    <CardDescription>Retrouvez, modifiez et gérez les profils de tous les volontaires.</CardDescription>
                    <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Rechercher par nom, prénom, email..." 
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full md:w-auto">
                                    <ArrowDownUp className="mr-2 h-4 w-4" />
                                    Trier par
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'createdAt', direction: 'desc' })}>Plus récent</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'createdAt', direction: 'asc' })}>Plus ancien</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'lastName', direction: 'asc' })}>Nom (A-Z)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'lastName', direction: 'desc' })}>Nom (Z-A)</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Avatar</span>
                                </TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="hidden md:table-cell">Compétences</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2 mt-1" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="h-6 w-24 rounded-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                filteredAndSortedVolunteers.map((volunteer) => (
                                    <TableRow key={volunteer.id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Avatar className="h-10 w-10">
                                                {/* Assuming no avatar URL for now */}
                                                <AvatarFallback>{volunteer.firstName?.[0]}{volunteer.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div>{volunteer.firstName} {volunteer.lastName}</div>
                                            <div className="text-sm text-muted-foreground">{volunteer.email}</div>
                                        </TableCell>
                                        <TableCell><Badge variant={getStatusBadgeVariant(volunteer.status || 'En attente')}>{volunteer.status || 'En attente'}</Badge></TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {volunteer.skills?.slice(0, 3).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                                {volunteer.skills && volunteer.skills.length > 3 && <Badge variant="outline">...</Badge>}
                                            </div>
                                        </TableCell>
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
                                                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                                    <DropdownMenuItem>Assigner à une mission</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {volunteer.status === 'En attente' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => updateVolunteerStatus(volunteer.id, 'Actif')}>Approuver</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive" onClick={() => updateVolunteerStatus(volunteer.id, 'Rejeté')}>Rejeter</DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {volunteer.status === 'Actif' && (
                                                        <DropdownMenuItem className="text-destructive" onClick={() => updateVolunteerStatus(volunteer.id, 'Inactif')}>Rendre Inactif</DropdownMenuItem>
                                                    )}
                                                    {(volunteer.status === 'Inactif' || volunteer.status === 'Rejeté') && (
                                                        <DropdownMenuItem onClick={() => updateVolunteerStatus(volunteer.id, 'Actif')}>Réactiver</DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                             {!loading && filteredAndSortedVolunteers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                    {searchTerm ? "Aucun volontaire ne correspond à votre recherche." : "Aucun volontaire trouvé."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
