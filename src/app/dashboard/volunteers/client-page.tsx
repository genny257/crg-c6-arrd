
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, Search, ArrowDownUp, Download, Check, X, Shield, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Volunteer } from "@/types/volunteer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/use-auth";

const getStatusBadgeVariant = (status?: Volunteer['status']) => {
    switch (status) {
        case 'ACTIVE': return 'default';
        case 'PENDING': return 'secondary';
        case 'INACTIVE': return 'outline';
        case 'REJECTED': return 'destructive';
        default: return 'secondary';
    }
};

const statusText: Record<Volunteer['status'], string> = {
    'ACTIVE': 'Actif',
    'PENDING': 'En attente',
    'INACTIVE': 'Inactif',
    'REJECTED': 'Rejeté'
};

interface VolunteersClientPageProps {
    initialVolunteers: Volunteer[];
    allSkills: string[];
    allProfessions: string[];
    allCells: string[];
}

export function VolunteersClientPage({ initialVolunteers, allCells, allProfessions, allSkills }: VolunteersClientPageProps) {
    const { token } = useAuth();
    const { toast } = useToast();
    const [volunteers, setVolunteers] = React.useState<Volunteer[]>(initialVolunteers);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
    const [cellFilter, setCellFilter] = React.useState<string | null>(null);
    const [skillFilter, setSkillFilter] = React.useState<string | null>(null);
    const [professionFilter, setProfessionFilter] = React.useState<string | null>(null);
    const [sortConfig, setSortConfig] = React.useState<{ key: 'name' | 'date'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
    const [volunteerToUpdate, setVolunteerToUpdate] = React.useState<{id: string, status: 'ACTIVE' | 'REJECTED'} | null>(null);


    const updateVolunteerStatus = async (id: string, status: 'ACTIVE' | 'REJECTED') => {
        if (!id || !token) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteers/${id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                 throw new Error('Failed to update status');
            }

            setVolunteers(volunteers.map(v => v.id === id ? { ...v, status } : v));
            toast({
                title: "Statut mis à jour",
                description: `Le volontaire a été marqué comme ${status.toLowerCase()}.`,
            });
        } catch (error) {
            console.error("Error updating volunteer status: ", error);
            toast({
                title: "Erreur",
                description: "Le statut du volontaire n'a pas pu être modifié.",
                variant: "destructive",
            });
        }
    };
    
    const filteredAndSortedVolunteers = React.useMemo(() => {
        let sortedVolunteers = [...volunteers];

        if (statusFilter) {
            sortedVolunteers = sortedVolunteers.filter(v => v.status === statusFilter);
        }

        if (cellFilter) {
            sortedVolunteers = sortedVolunteers.filter(v => v.assignedCell === cellFilter);
        }

        if (skillFilter) {
            sortedVolunteers = sortedVolunteers.filter(v => v.skills?.includes(skillFilter));
        }
        
        if (professionFilter) {
            sortedVolunteers = sortedVolunteers.filter(v => v.profession === professionFilter);
        }

        if (searchTerm) {
            sortedVolunteers = sortedVolunteers.filter(v =>
                `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        sortedVolunteers.sort((a, b) => {
            if (sortConfig.key === 'name') {
                const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
                const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
                if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            } else { // sort by date
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }
        });

        return sortedVolunteers;
    }, [volunteers, searchTerm, statusFilter, sortConfig, cellFilter, skillFilter, professionFilter]);


    return (
        <div className="flex flex-col gap-8">
             <AlertDialog onOpenChange={(open) => !open && setVolunteerToUpdate(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer l'action</AlertDialogTitle>
                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir {volunteerToUpdate?.status === 'ACTIVE' ? 'approuver' : 'rejeter'} cette candidature ?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => volunteerToUpdate && updateVolunteerStatus(volunteerToUpdate.id, volunteerToUpdate.status)}>
                        Confirmer
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-headline font-bold">Gestion des Volontaires</h1>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Exporter la liste
                        </Button>
                        <Button asChild>
                            <Link href="/register">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Ajouter un volontaire
                            </Link>
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des volontaires</CardTitle>
                        <CardDescription>
                            Consultez, filtrez et gérez tous les volontaires inscrits.
                        </CardDescription>
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
                            <Select onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="PENDING">En attente</SelectItem>
                                    <SelectItem value="ACTIVE">Actif</SelectItem>
                                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                                    <SelectItem value="REJECTED">Rejeté</SelectItem>
                                </SelectContent>
                            </Select>
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                         <Button variant="ghost" onClick={() => setSortConfig(c => ({key: 'name', direction: c.key === 'name' && c.direction === 'asc' ? 'desc' : 'asc'}))}>
                                            Nom
                                            <ArrowDownUp className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">Cellule</TableHead>
                                    <TableHead className="hidden lg:table-cell">
                                        <Button variant="ghost" onClick={() => setSortConfig(c => ({key: 'date', direction: c.key === 'date' && c.direction === 'asc' ? 'desc' : 'asc'}))}>
                                            Inscrit le
                                            <ArrowDownUp className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedVolunteers.map((volunteer) => (
                                    <TableRow key={volunteer.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={volunteer.photo} alt={volunteer.firstName} />
                                                    <AvatarFallback>{volunteer.firstName?.[0]}{volunteer.lastName?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{volunteer.lastName} {volunteer.firstName}</div>
                                                    <div className="text-sm text-muted-foreground">{volunteer.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {volunteer.assignedCell || <span className="text-muted-foreground">N/A</span>}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {new Date(volunteer.createdAt).toLocaleDateString('fr-FR')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(volunteer.status)}>{statusText[volunteer.status]}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {volunteer.status === 'PENDING' ? (
                                                <div className="flex gap-2">
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="icon" onClick={() => setVolunteerToUpdate({ id: volunteer.id, status: 'ACTIVE' })}>
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                     <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="icon" onClick={() => setVolunteerToUpdate({ id: volunteer.id, status: 'REJECTED' })}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                     <Button asChild variant="ghost" size="icon">
                                                        <Link href={`/dashboard/volunteers/${volunteer.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ) : (
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
                                                            <Link href={`/dashboard/volunteers/${volunteer.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" /> Voir le profil
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Shield className="mr-2 h-4 w-4" /> Changer le statut
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {filteredAndSortedVolunteers.length === 0 && (
                            <div className="text-center p-8 text-muted-foreground">
                                Aucun volontaire ne correspond aux critères de filtre.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </AlertDialog>
        </div>
    );
}
