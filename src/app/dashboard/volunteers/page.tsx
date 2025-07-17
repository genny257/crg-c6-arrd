import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const volunteers = [
    { id: "VOL001", name: "Alice Martin", email: "alice.m@example.com", phone: "+241 07 11 22 33", status: "Actif", avatar: "https://placehold.co/40x40.png", skills: ["Premiers secours", "Logistique"] },
    { id: "VOL002", name: "Bob Kassa", email: "bob.k@example.com", phone: "+241 06 44 55 66", status: "En attente", avatar: "https://placehold.co/40x40.png", skills: ["Conduite"] },
    { id: "VOL003", name: "Charlie Nguema", email: "charlie.n@example.com", phone: "+241 05 77 88 99", status: "Inactif", avatar: "https://placehold.co/40x40.png", skills: ["Communication", "Cuisine"] },
    { id: "VOL004", name: "David Mouele", email: "david.m@example.com", phone: "+241 02 12 34 56", status: "Actif", avatar: "https://placehold.co/40x40.png", skills: ["Informatique"] },
    { id: "VOL005", name: "Eva Obiang", email: "eva.o@example.com", phone: "+241 03 98 76 54", status: "Rejeté", avatar: "https://placehold.co/40x40.png", skills: [] },
];

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
                            {volunteers.map((volunteer) => (
                                <TableRow key={volunteer.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={volunteer.avatar} alt={volunteer.name} data-ai-hint="person portrait" />
                                            <AvatarFallback>{volunteer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>{volunteer.name}</div>
                                        <div className="text-sm text-muted-foreground">{volunteer.email}</div>
                                    </TableCell>
                                    <TableCell><Badge variant={getStatusBadgeVariant(volunteer.status)}>{volunteer.status}</Badge></TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {volunteer.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
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
                                                <DropdownMenuItem>Approuver</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Rejeter</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
