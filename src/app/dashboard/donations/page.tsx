import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const donations = [
    { id: "DON001", amount: 150.00, method: "Carte de crédit", date: "2024-07-15", donor: "Jean Dupont", email: "jean.dupont@example.com", receipt: "Voir" },
    { id: "DON002", amount: 75.50, method: "Mobile Money", date: "2024-07-14", donor: "Marie Claire", email: "marie.claire@example.com", receipt: "Générer" },
    { id: "DON003", amount: 500.00, method: "Virement", date: "2024-07-13", donor: "Pierre ABESSOLO", email: "pierre.abessolo@example.com", receipt: "Voir" },
    { id: "DON004", amount: 25.00, method: "Mobile Money", date: "2024-07-12", donor: "Aïcha Diallo", email: "aicha.diallo@example.com", receipt: "Générer" },
    { id: "DON005", amount: 300.00, method: "Carte de crédit", date: "2024-07-11", donor: "Fatou N'diaye", email: "fatou.ndiaye@example.com", receipt: "Voir" },
];

export default function DonationsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold">Rapports sur les Dons</h1>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter en CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historique des Dons</CardTitle>
                    <CardDescription>Liste de toutes les donations reçues.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Donateur</TableHead>
                                <TableHead className="hidden md:table-cell">Montant</TableHead>
                                <TableHead className="hidden md:table-cell">Méthode</TableHead>
                                <TableHead className="hidden lg:table-cell">Date</TableHead>
                                <TableHead>Reçu</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donations.map((donation) => (
                                <TableRow key={donation.id}>
                                    <TableCell>
                                        <div className="font-medium">{donation.donor}</div>
                                        <div className="text-sm text-muted-foreground">{donation.email}</div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{donation.amount.toFixed(2)} €</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant={donation.method === 'Carte de crédit' ? 'default' : 'secondary'}>{donation.method}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">{donation.date}</TableCell>
                                    <TableCell>
                                        <Button variant="link" className="p-0 h-auto">{donation.receipt}</Button>
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
                                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                                <DropdownMenuItem>Contacter le donateur</DropdownMenuItem>
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
