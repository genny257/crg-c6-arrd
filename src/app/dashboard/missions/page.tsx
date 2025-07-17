import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilePlus2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Image from "next/image";

const missions = [
    { id: "MIS001", title: "Distribution de nourriture", location: "Libreville", startDate: "2024-08-01", endDate: "2024-08-03", status: "Planifiée" },
    { id: "MIS002", title: "Campagne de vaccination", location: "Port-Gentil", startDate: "2024-07-20", endDate: "2024-07-25", status: "En cours" },
    { id: "MIS003", title: "Formation aux premiers secours", location: "Franceville", startDate: "2024-07-05", endDate: "2024-07-07", status: "Terminée" },
    { id: "MIS004", title: "Aide aux sinistrés (inondations)", location: "Lambaréné", startDate: "2024-06-10", endDate: "2024-06-20", status: "Annulée" },
    { id: "MIS005", title: "Collecte de sang", location: "Oyem", startDate: "2024-08-15", endDate: "2024-08-15", status: "Planifiée" },
];

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
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Gestion des Missions</h1>
                <Button>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Créer une Mission
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
                                {missions.map((mission) => (
                                    <TableRow key={mission.id}>
                                        <TableCell className="font-medium">{mission.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">{mission.location}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{mission.startDate}</TableCell>
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
                                                    <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
