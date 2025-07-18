
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, MapPin, MoreVertical, Pencil, PlusCircle, Trash2, XCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";


const events = [
    {
        title: "Grande Collecte de Sang",
        date: "15 Août 2024",
        location: "Siège du Comité, Libreville",
        description: "Chaque don compte. Rejoignez-nous pour notre grande collecte de sang annuelle et aidez à sauver des vies.",
        image: "https://placehold.co/600x400.png",
        imageHint: "blood donation",
        status: "À venir"
    },
    {
        title: "Journée de Formation aux Premiers Secours",
        date: "25 Août 2024",
        location: "Lycée Djoué Dabany, PK10",
        description: "Apprenez les gestes qui sauvent. Formation gratuite et ouverte à tous sur inscription.",
        image: "https://placehold.co/600x400.png",
        imageHint: "first aid training",
        status: "À venir"
    },
    {
        title: "Campagne de Sensibilisation Paludisme",
        date: "05 Septembre 2024",
        location: "Marché de Nzeng-Ayong",
        description: "Informez-vous sur les moyens de prévention contre le paludisme et recevez des moustiquaires imprégnées.",
        image: "https://placehold.co/600x400.png",
        imageHint: "community health",
        status: "Annulé"
    }
];

export default function EventsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-headline font-bold">Évènements</h2>
                <p className="text-muted-foreground">Participez à nos prochains évènements et engagez-vous à nos côtés.</p>
            </div>
            
            {isAdmin && (
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer un événement
                </Button>
            )}
            
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <Card key={event.title} className="flex flex-col relative">
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
                                <DropdownMenuItem>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    <span>{event.status !== 'Annulé' ? 'Annuler' : 'Réactiver'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Supprimer</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <CardHeader className="p-0">
                         <Image
                            src={event.image}
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
                            <span>{event.date}</span>
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
            ))}
        </div>
    </div>
  )
}
