
"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

const donations = [
    { id: "DON001", name: "John Doe", amount: 10000, type: "Ponctuel", method: "Mobile Money", date: "2024-07-15", status: "Confirmé" },
    { id: "DON002", name: "Jane Smith", amount: 5000, type: "Mensuel", method: "Carte Bancaire", date: "2024-07-14", status: "Confirmé" },
    { id: "DON003", name: "Anonymous", amount: 20000, type: "Ponctuel", method: "Carte Bancaire", date: "2024-07-13", status: "Confirmé" },
    { id: "DON004", name: "Paul Dubois", amount: 2000, type: "Ponctuel", method: "Mobile Money", date: "2024-07-12", status: "En attente" },
    { id: "DON005", name: "Aïcha Traoré", amount: 5000, type: "Mensuel", method: "Carte Bancaire", date: "2024-07-11", status: "Échoué" },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Confirmé': return 'default';
        case 'En attente': return 'secondary';
        case 'Échoué': return 'destructive';
        default: return 'outline';
    }
};

export default function DonationPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Gestion des Dons</h1>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter la liste
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Historique des Dons</CardTitle>
                    <CardDescription>Consultez la liste de toutes les contributions reçues.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Donateur</TableHead>
                                <TableHead className="hidden md:table-cell">Montant (FCFA)</TableHead>
                                <TableHead className="hidden lg:table-cell">Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donations.map((donation) => (
                                <TableRow key={donation.id}>
                                    <TableCell className="font-medium">{donation.name}</TableCell>
                                    <TableCell className="hidden md:table-cell">{donation.amount.toLocaleString('fr-FR')}</TableCell>
                                    <TableCell className="hidden lg:table-cell">{donation.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(donation.status)}>{donation.status}</Badge>
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
                                                <DropdownMenuItem>Voir le détail</DropdownMenuItem>
                                                <DropdownMenuItem>Envoyer un reçu</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Affichage de <strong>1-5</strong> sur <strong>{donations.length}</strong> dons.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
