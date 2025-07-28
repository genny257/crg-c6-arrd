
"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
type AppointmentReason = 'VOLUNTEERING_INFO' | 'TRAINING_INFO' | 'PARTNERSHIP' | 'OTHER';

type Appointment = {
  id: string;
  name: string;
  email: string;
  reason: AppointmentReason;
  scheduledAt: string;
  status: AppointmentStatus;
  createdAt: string;
};

const getStatusBadgeVariant = (status: AppointmentStatus) => {
  switch (status) {
    case 'CONFIRMED': return 'default';
    case 'PENDING': return 'secondary';
    case 'CANCELLED': return 'destructive';
    default: return 'outline';
  }
};

const statusText = {
    'PENDING': 'En attente',
    'CONFIRMED': 'Confirmé',
    'CANCELLED': 'Annulé'
};

const reasonText = {
    'VOLUNTEERING_INFO': 'Info Volontariat',
    'TRAINING_INFO': 'Info Formations',
    'PARTNERSHIP': 'Partenariat',
    'OTHER': 'Autre'
};

export default function AppointmentsPage() {
  const { user, loading: authLoading, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAppointments = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
    } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les rendez-vous.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  }, [token, toast]);

  React.useEffect(() => {
    if (!authLoading && user) {
        fetchAppointments();
    } else if (!authLoading && !user) {
        router.push('/dashboard');
    }
  }, [user, authLoading, router, fetchAppointments]);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    if (!token) return;
    
    const originalAppointments = [...appointments];
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error("La mise à jour a échoué");
        toast({ title: "Statut mis à jour", description: `Le rendez-vous est maintenant "${statusText[status]}".` });
    } catch (error) {
        setAppointments(originalAppointments);
        toast({ title: "Erreur", description: "La mise à jour du statut a échoué.", variant: "destructive" });
    }
  };

  if (authLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-headline font-bold">Gestion des Rendez-vous</h1>
      <Card>
        <CardHeader>
          <CardTitle>Demandes de rendez-vous</CardTitle>
          <CardDescription>Consultez et gérez toutes les demandes de rendez-vous.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Demandeur</TableHead>
                <TableHead className="hidden md:table-cell">Date & Heure</TableHead>
                <TableHead className="hidden lg:table-cell">Motif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : appointments.length > 0 ? (
                appointments.map((rdv) => (
                  <TableRow key={rdv.id}>
                    <TableCell className="font-medium">{rdv.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(rdv.scheduledAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</TableCell>
                    <TableCell className="hidden lg:table-cell">{reasonText[rdv.reason]}</TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(rdv.status)}>{statusText[rdv.status]}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {rdv.status !== 'CONFIRMED' && <DropdownMenuItem onClick={() => handleUpdateStatus(rdv.id, 'CONFIRMED')}><CheckCircle className="mr-2 h-4 w-4" />Confirmer</DropdownMenuItem>}
                          {rdv.status !== 'CANCELLED' && <DropdownMenuItem onClick={() => handleUpdateStatus(rdv.id, 'CANCELLED')}><XCircle className="mr-2 h-4 w-4" />Annuler</DropdownMenuItem>}
                          {rdv.status === 'CANCELLED' && <DropdownMenuItem onClick={() => handleUpdateStatus(rdv.id, 'PENDING')}><Clock className="mr-2 h-4 w-4" />Réactiver</DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild><a href={`mailto:${rdv.email}`}>Contacter</a></DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">Aucune demande de rendez-vous pour le moment.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
