
"use client"

import * as React from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, MapPin, MoreVertical, Pencil, PlusCircle, Trash2, XCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase/client";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function EventsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchEvents = React.useCallback(async () => {
    setLoading(true);
    try {
      const q = isAdmin 
        ? query(collection(db, "events"), orderBy("date", "desc"))
        : query(collection(db, "events"), where("status", "in", ["À venir", "Terminé"]), orderBy("date", "desc"));
      
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
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
    if (!id) return;
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(events.filter(e => e.id !== id));
      toast({ title: "Succès", description: "L'événement a été supprimé." });
    } catch (error) {
      console.error("Error deleting event: ", error);
      toast({ title: "Erreur", description: "La suppression de l'événement a échoué.", variant: "destructive" });
    }
  };

  const toggleStatus = async (id: string, currentStatus: Event['status']) => {
     if (!id) return;
     const newStatus = currentStatus === 'Annulé' ? 'À venir' : 'Annulé';
    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, { status: newStatus });
      setEvents(events.map(e => e.id === id ? { ...e, status: newStatus } : e));
      toast({ title: "Succès", description: `L'événement est maintenant marqué comme ${newStatus.toLowerCase()}.` });
    } catch (error) {
      console.error("Error toggling status: ", error);
      toast({ title: "Erreur", description: "Le changement de statut a échoué.", variant: "destructive" });
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
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Modifier</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleStatus(event.id, event.status)}>
                      {event.status !== 'Annulé' ? (
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
                  data-ai-hint={event.imageHint}
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
                <Button disabled={event.status === 'Annulé'}>S'inscrire</Button>
                {event.status === 'Annulé' && <span className="text-xs font-semibold text-destructive">Annulé</span>}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
