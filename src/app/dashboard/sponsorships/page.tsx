
"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Eye, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type SponsorshipStatus = 'PENDING' | 'CONTACTED' | 'IN_DISCUSSION' | 'CONFIRMED' | 'REJECTED';

type SponsorshipRequest = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  message: string;
  status: SponsorshipStatus;
  createdAt: string;
};

const getStatusBadgeVariant = (status: SponsorshipRequest['status']) => {
  switch (status) {
    case 'CONFIRMED': return 'default';
    case 'IN_DISCUSSION': return 'secondary';
    case 'CONTACTED': return 'outline';
    case 'PENDING': return 'secondary';
    case 'REJECTED': return 'destructive';
    default: return 'outline';
  }
};

const statusText = {
    'PENDING': 'En attente',
    'CONTACTED': 'Contacté',
    'IN_DISCUSSION': 'En discussion',
    'CONFIRMED': 'Confirmé',
    'REJECTED': 'Rejeté'
}


export default function SponsorshipsPage() {
  const { user, loading: authLoading, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = React.useState<SponsorshipRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRequest, setSelectedRequest] = React.useState<SponsorshipRequest | null>(null);

  React.useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'superadmin'))) {
      router.push('/dashboard');
      toast({ title: "Accès non autorisé", variant: "destructive" });
      return;
    }

    const fetchSponsorships = async () => {
      if (!token) {
          setLoading(false);
          return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsorships`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch sponsorships");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching sponsorships:", error);
        toast({ title: "Erreur", description: "Impossible de charger les demandes.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSponsorships();
  }, [user, authLoading, router, toast, token]);
  
  const handleUpdateStatus = async (id: string, status: SponsorshipRequest['status']) => {
      if (!token) return;
      
      const originalRequests = [...requests];
      setRequests(reqs => reqs.map(r => r.id === id ? {...r, status} : r));

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sponsorships/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error("Failed to update status");
        toast({title: "Statut mis à jour", description: `La demande est maintenant marquée comme "${statusText[status]}".`})
      } catch (error) {
        setRequests(originalRequests);
        toast({title: "Erreur", description: "La mise à jour du statut a échoué.", variant: "destructive"});
      }
  }

  if (authLoading || loading) {
      return (
          <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Card>
                  <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
                  <CardContent>
                      <div className="space-y-2">
                         {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                      </div>
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
        <Building className="w-8 h-8"/> Demandes de Mécénat
      </h1>
      
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedRequest?.companyName}</AlertDialogTitle>
            <AlertDialogDescription>
              Message de {selectedRequest?.contactName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p className="py-4 text-sm bg-muted p-4 rounded-md">{selectedRequest?.message}</p>
        </AlertDialogContent>

        <Card>
          <CardHeader>
            <CardTitle>Boîte de réception</CardTitle>
            <CardDescription>
              Liste des demandes de partenariat reçues des entreprises.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entreprise</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">Aucune demande pour le moment.</TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.companyName}</TableCell>
                      <TableCell className="hidden md:table-cell">{request.contactName}</TableCell>
                      <TableCell className="hidden lg:table-cell">{format(new Date(request.createdAt), 'd MMMM yyyy', {locale: fr})}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(request.status)}>{statusText[request.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={() => setSelectedRequest(request)}>
                                    <Eye className="mr-2 h-4 w-4" /> Voir le message
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <DropdownMenuItem asChild>
                                <a href={`mailto:${request.email}`}>
                                    <Mail className="mr-2 h-4 w-4" /> Contacter
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, 'CONTACTED')}>Marquer comme contacté</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, 'IN_DISCUSSION')}>Marquer comme en discussion</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, 'CONFIRMED')}>Marquer comme confirmé</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(request.id, 'REJECTED')}>Marquer comme rejeté</DropdownMenuItem>
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
      </AlertDialog>
    </div>
  );
}
