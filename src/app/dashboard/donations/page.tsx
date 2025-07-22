
"use client"
import * as React from "react";
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
import { useToast } from "@/hooks/use-toast";
import type { Donation } from "@/types/donation";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Confirmé': return 'default';
        case 'En_attente': return 'secondary';
        case 'Échoué': return 'destructive';
        default: return 'outline';
    }
};


export default function DonationPage() {
    const { token } = useAuth();
    const [donations, setDonations] = React.useState<Donation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const fetchDonations = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch donations");

            const data = await response.json();
            // Sort donations by date, most recent first
            data.sort((a: Donation, b: Donation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setDonations(data);
        } catch (error) {
            console.error("Error fetching donations: ", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les dons.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast, token]);

    React.useEffect(() => {
        if (token) {
            fetchDonations();
        }
    }, [fetchDonations, token]);


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
                             {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                donations.map((donation) => (
                                    <TableRow key={donation.id}>
                                        <TableCell className="font-medium">{donation.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">{donation.amount.toLocaleString('fr-FR')}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {format(new Date(donation.createdAt), "d MMM yyyy", { locale: fr })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(donation.status)}>{donation.status.replace('_', ' ')}</Badge>
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                    <div className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{
                        __html: !loading ? `Affichage de <strong>${donations.length}</strong> sur <strong>${donations.length}</strong> dons.` : ''
                    }} />
                </CardFooter>
            </Card>
        </div>
    );
}
