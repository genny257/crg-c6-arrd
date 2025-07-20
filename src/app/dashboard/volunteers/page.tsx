
"use client";

import * as React from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, Search, ArrowDownUp, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase/client";
import type { Volunteer } from "@/types/volunteer";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { utils, writeFile } from 'xlsx';
import { cells, professionsList, skillsList as allSkillsGroups } from "@/lib/locations";
import Link from "next/link";


const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Actif': return 'default';
        case 'En attente': return 'secondary';
        case 'Inactif': return 'outline';
        case 'Rejeté': return 'destructive';
        default: return 'secondary';
    }
};

const allCells = [
    "Nzeng-Ayong Lac",
    "Nzeng-Ayong Village",
    "Ondogo",
    "PK6-PK9",
    "PK9-Bikélé",
];

export default function VolunteersPage() {
    const [volunteers, setVolunteers] = React.useState<Volunteer[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{ key: 'createdAt' | 'lastName'; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
    const [skillFilter, setSkillFilter] = React.useState<string | null>(null);
    const [cellFilter, setCellFilter] = React.useState<string | null>(null);
    const [professionFilter, setProfessionFilter] = React.useState<string | null>(null);

    const [allSkills, setAllSkills] = React.useState<string[]>([]);
    const [allProfessions, setAllProfessions] = React.useState<string[]>([]);


    const fetchVolunteers = React.useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "volunteers"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const volunteersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Volunteer));
            setVolunteers(volunteersData);

            const skills = new Set<string>();
            const professions = new Set<string>();
            volunteersData.forEach(v => {
                v.skills?.forEach(skill => skills.add(skill));
                if (v.profession) professions.add(v.profession);
            });
            setAllSkills(Array.from(skills).sort());
            setAllProfessions(Array.from(professions).sort());

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
        let filteredVolunteers = [...volunteers];

        if (skillFilter) {
            filteredVolunteers = filteredVolunteers.filter(v => v.skills?.includes(skillFilter));
        }
        
        if (professionFilter) {
            filteredVolunteers = filteredVolunteers.filter(v => v.profession === professionFilter);
        }

        if (cellFilter) {
            filteredVolunteers = filteredVolunteers.filter(v => v.assignedCell === cellFilter);
        }
    
        if (searchTerm) {
          filteredVolunteers = filteredVolunteers.filter(v => 
            `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
    
        filteredVolunteers.sort((a, b) => {
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
    
        return filteredVolunteers;
      }, [volunteers, searchTerm, sortConfig, skillFilter, cellFilter, professionFilter]);

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

    const handleExport = () => {
        const dataToExport = filteredAndSortedVolunteers.map(v => ({
            "Matricule": v.matricule || 'N/A',
            "Nom": v.lastName,
            "Prénom": v.firstName,
            "Email": v.email,
            "Téléphone": v.phone,
            "Cellule": v.assignedCell,
            "Statut": v.status,
            "Date d'inscription": new Date(v.createdAt).toLocaleDateString('fr-FR'),
            "Compétences": v.skills?.join(', '),
        }));

        const worksheet = utils.json_to_sheet(dataToExport);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Volontaires");
        writeFile(workbook, "Liste_Volontaires.xlsx");
    };


    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Gestion des Volontaires</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Exporter la liste
                    </Button>
                    <Button asChild>
                        <Link href="/register">
                             <UserPlus className="mr-2 h-4 w-4" />
                             Ajouter un Volontaire
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Volontaires</CardTitle>
                    <CardDescription>Retrouvez, modifiez et gérez les profils de tous les volontaires.</CardDescription>
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative lg:col-span-4">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Rechercher par nom, prénom, email..." 
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <Select onValueChange={(value) => setCellFilter(value === 'all' ? null : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrer par cellule" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les cellules</SelectItem>
                                {allCells.map(cell => (
                                    <SelectItem key={cell} value={cell}>{cell}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setSkillFilter(value === 'all' ? null : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrer par compétence" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les compétences</SelectItem>
                                {allSkills.map(skill => (
                                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value) => setProfessionFilter(value === 'all' ? null : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrer par profession" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les professions</SelectItem>
                                {allProfessions.map(profession => (
                                    <SelectItem key={profession} value={profession}>{profession}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
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
                                <TableHead className="hidden md:table-cell">Cellule</TableHead>
                                <TableHead className="hidden lg:table-cell">Compétences</TableHead>
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
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
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
                                                <AvatarImage src={volunteer.photo} alt={`${volunteer.firstName} ${volunteer.lastName}`} />
                                                <AvatarFallback>{volunteer.firstName?.[0]}{volunteer.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div>{volunteer.firstName} {volunteer.lastName}</div>
                                            <div className="text-sm text-muted-foreground">{volunteer.email}</div>
                                        </TableCell>
                                        <TableCell><Badge variant={getStatusBadgeVariant(volunteer.status || 'En attente')}>{volunteer.status || 'En attente'}</Badge></TableCell>
                                        <TableCell className="hidden md:table-cell">{volunteer.assignedCell || 'N/A'}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {volunteer.skills?.slice(0, 2).map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                                {volunteer.skills && volunteer.skills.length > 2 && <Badge variant="outline">...</Badge>}
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
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/volunteers/${volunteer.id}`}>Voir le profil</Link>
                                                    </DropdownMenuItem>
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
                                    <TableCell colSpan={6} className="h-24 text-center">
                                    {searchTerm || skillFilter || cellFilter || professionFilter ? "Aucun volontaire ne correspond à votre recherche." : "Aucun volontaire trouvé."}
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
