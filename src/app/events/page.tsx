
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, MapPin, MoreVertical, Pencil, PlusCircle, Trash2, XCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { type Event, EventStatus } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusText: Record<EventStatus, string> = {
  UPCOMING: "À venir",
  PAST: "Terminé",
  CANCELLED: "Annulé",
};

export default function EventsPage() {
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchEvents = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let eventsData: Event[] = await response.json();
            
            // On the public page, only admins see cancelled events
            if (!isAdmin) {
                eventsData = eventsData.filter(e => e.status !== 'CANCELLED');
            }
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events: ", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les évènements.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [isAdmin, toast]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id: string) => {
    if (!id || !token) return;

    const originalEvents = [...events];
    setEvents(events.filter(e => e.id !== id));

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("La suppression a échoué.");
        toast({ title: "Succès", description: "L'événement a été supprimé." });
    } catch(error) {
        toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive" });
        setEvents(originalEvents);
    }
  };

  const toggleStatus = async (id: string, currentStatus: EventStatus) => {
    if (!id || !token) return;
    const newStatus: EventStatus = currentStatus === 'CANCELLED' ? 'UPCOMING' : 'CANCELLED';
    
    const originalEvents = [...events];
    setEvents(events.map(e => e.id === id ? { ...e, status: newStatus } : e));
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("La mise à jour a échoué.");
        toast({ title: "Succès", description: `L'événement est maintenant marqué comme ${statusText[newStatus].toLowerCase()}.` });
        fetchEvents();
    } catch (error) {
        toast({ title: "Erreur", description: "La mise à jour a échoué.", variant: "destructive" });
        setEvents(originalEvents);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold">Évènements</h2>
          <p className="text-muted-foreground">Participez à nos prochains évènements et engagez-vous à nos côtés.</p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/events/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer un événement
            </Link>
          </Button>
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="p-0">
                <Skeleton className="rounded-t-lg aspect-video" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))
        ) : (
          events.map((event) => (
            <Card key={event.id} className="flex flex-col relative">
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-black/20 hover:bg-black/50 text-white hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/events/${event.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(event.id, event.status)}>
                      {event.status !== 'CANCELLED' ? (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Annuler</span>
                        </>
                      ) : (
                        <>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          <span>Réactiver</span>
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Supprimer</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <CardHeader className="p-0">
                <Image
                  src={event.image || "https://placehold.co/600x400.png"}
                  alt={event.title}
                  data-ai-hint={event.imageHint ?? undefined}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover aspect-video"
                />
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <CardTitle className="font-headline text-xl mb-2">{event.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(event.date), "d MMMM yyyy", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <CardDescription>{event.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <Button disabled={event.status === 'CANCELLED' || event.status === 'PAST'}>S'inscrire</Button>
                {event.status === 'CANCELLED' && <span className="text-xs font-semibold text-destructive">{statusText[event.status]}</span>}
                {event.status === 'PAST' && <span className="text-xs font-semibold text-gray-500">{statusText[event.status]}</span>}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
