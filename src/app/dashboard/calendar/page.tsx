
"use client"
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Mission } from "@/types/mission";
import type { Event } from "@/types/event";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


type CalendarEvent = {
    date: Date;
    title: string;
    type: 'Mission' | 'Événement';
    status?: string;
    id: string;
    href: string;
    location: string;
    coords?: [number, number];
};

const getEventTypeClass = (type: CalendarEvent['type']) => {
    switch (type) {
        case 'Mission': return 'bg-blue-500';
        case 'Événement': return 'bg-green-500';
    }
};

// Mock geocoding function
const geocodeLocation = (location: string): [number, number] | undefined => {
    const locations: { [key: string]: [number, number] } = {
        "Libreville": [0.3924, 9.4536],
        "Siège du Comité, Libreville": [0.416, 9.46],
        "Hôtel de ville": [0.390, 9.455],
        "Port-Gentil": [-0.7193, 8.7815],
        "Franceville": [-1.6333, 13.5833],
        "Oyem": [1.5996, 11.5794],
        "Moanda": [-1.565, 13.196],
        "Lycée X": [0.45, 9.50],
        "École Publique d'Ondogo": [0.5, 9.4]
    };
    const lowerCaseLocation = location.toLowerCase();
    for (const key in locations) {
        if (lowerCaseLocation.includes(key.toLowerCase())) {
            return locations[key];
        }
    }
    return undefined; // Default or undefined if not found
};


const MapComponent = ({ events }: { events: CalendarEvent[] }) => {
    const validEvents = events.filter(e => e.coords);

    return (
        <MapContainer center={[0.3924, 9.4536]} zoom={7} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {validEvents.map(event => (
                 <Marker key={event.id} position={event.coords!}>
                    <Popup>
                        <div className="font-sans">
                            <h4 className="font-bold">{event.title}</h4>
                            <p>{format(event.date, "d MMM yyyy", { locale: fr })}</p>
                            <p className="text-gray-600">{event.location}</p>
                            <a href={event.href} className="text-blue-600 hover:underline">Voir détails</a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}


export default function CalendarPage() {
    const { toast } = useToast();
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [events, setEvents] = React.useState<CalendarEvent[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchEventsAndMissions = async () => {
          setLoading(true);
          try {
              const [missionsRes, eventsRes] = await Promise.all([
                  fetch('http://localhost:3001/api/missions'),
                  fetch('http://localhost:3001/api/events')
              ]);

              if (!missionsRes.ok || !eventsRes.ok) {
                  throw new Error('Failed to fetch data');
              }

              const missions: Mission[] = await missionsRes.json();
              const events: Event[] = await eventsRes.json();

              const missionsData = missions.map(data => ({
                  id: data.id,
                  date: new Date(data.startDate),
                  title: data.title,
                  type: 'Mission' as const,
                  status: data.status,
                  href: `/dashboard/missions/${data.id}`,
                  location: data.location,
                  coords: geocodeLocation(data.location)
              }));

              const eventsData = events.map(data => ({
                  id: data.id,
                  date: new Date(data.date),
                  title: data.title,
                  type: 'Événement' as const,
                  status: data.status,
                  href: `/dashboard/events`, // Assuming a generic events page for now
                  location: data.location,
                  coords: geocodeLocation(data.location)
              }));

              setEvents([...missionsData, ...eventsData]);

          } catch (error) {
              console.error("Error fetching calendar data:", error);
              toast({
                  title: "Erreur",
                  description: "Impossible de charger les données du calendrier.",
                  variant: "destructive",
              });
          } finally {
              setLoading(false);
          }
      };
      fetchEventsAndMissions();
    }, [toast]);


    const selectedDayEvents = React.useMemo(() => {
        return date ? events.filter(event => event.date.toDateString() === date.toDateString()) : [];
    }, [date, events]);

    const monthEvents = React.useMemo(() => {
        return events
            .filter(e => e.date.getMonth() === currentMonth.getMonth() && e.date.getFullYear() === currentMonth.getFullYear())
            .sort((a,b) => a.date.getTime() - b.date.getTime())
    }, [currentMonth, events]);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold">Calendrier & Carte</h1>
            <Tabs defaultValue="calendar">
                <TabsList>
                    <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                    <TabsTrigger value="map">Carte</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar" className="mt-4">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardContent className="p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    month={currentMonth}
                                    onMonthChange={setCurrentMonth}
                                    className="p-0"
                                    locale={fr}
                                    classNames={{
                                        months: "flex flex-col sm:flex-row",
                                        month: "space-y-4 p-4",
                                        caption: "flex justify-center pt-1 relative items-center",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "h-24 w-full text-left text-sm p-1 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-full w-full p-1 flex flex-col items-start justify-start rounded-md hover:bg-accent",
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                        day_today: "bg-accent text-accent-foreground",
                                        day_outside: "text-muted-foreground opacity-50",
                                    }}
                                    components={{
                                        DayContent: ({ date }) => {
                                            const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString());
                                            return (
                                                <>
                                                    <span>{date.getDate()}</span>
                                                    <div className="flex flex-col gap-1 mt-1">
                                                    {dayEvents.map(event => (
                                                        <div key={event.id} className="flex items-center gap-1.5 w-full">
                                                            <div className={cn("w-1.5 h-1.5 rounded-full", getEventTypeClass(event.type))}></div>
                                                            <span className="truncate text-xs">{event.title}</span>
                                                        </div>
                                                    ))}
                                                    </div>
                                                </>
                                            )
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Évènements du mois</CardTitle>
                                    <CardDescription>
                                        {format(currentMonth, "LLLL yyyy", { locale: fr })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 h-[30rem] overflow-y-auto">
                                    {loading ? (
                                        <div className="space-y-4">
                                            <Skeleton className="h-16 w-full" />
                                            <Skeleton className="h-16 w-full" />
                                            <Skeleton className="h-16 w-full" />
                                        </div>
                                    ) : (
                                        (selectedDayEvents.length > 0 ? selectedDayEvents : monthEvents).map(event => (
                                            <a href={event.href} key={event.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted cursor-pointer">
                                                <div className="flex flex-col items-center justify-center bg-muted text-muted-foreground rounded-md p-2 w-16">
                                                    <span className="text-xs uppercase">{format(event.date, 'MMM', { locale: fr })}</span>
                                                    <span className="text-lg font-bold">{event.date.getDate()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{event.title}</h4>
                                                    <Badge variant="secondary" className={cn("mt-1 text-xs", getEventTypeClass(event.type), "text-white")}>{event.type}</Badge>
                                                </div>
                                            </a>
                                        ))
                                    )}
                                    {!loading && monthEvents.length === 0 && (
                                        <p className="text-muted-foreground text-sm text-center py-8">Aucun évènement pour ce mois.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="map" className="mt-4">
                    <Card className="h-[70vh]">
                        <CardContent className="p-0 h-full w-full rounded-lg">
                           {loading ? <Skeleton className="h-full w-full" /> : <MapComponent events={events} />}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
