
"use client"
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as React from "react";
import { cn } from "@/lib/utils";

type Event = {
    date: Date;
    title: string;
    category: 'Mission' | 'Formation' | 'Collecte' | 'Réunion';
};

const events: Event[] = [
    { date: new Date(2024, 7, 1), title: "Distribution de nourriture", category: 'Mission' },
    { date: new Date(2024, 7, 20), title: "Campagne de vaccination", category: 'Mission' },
    { date: new Date(2024, 7, 15), title: "Grande Collecte de Sang", category: 'Collecte' },
    { date: new Date(2024, 6, 25), title: "Réunion de coordination", category: 'Réunion'},
    { date: new Date(2024, 7, 10), title: "Formation aux premiers secours", category: 'Formation'},
    { date: new Date(2024, 8, 5), title: "Sensibilisation Paludisme", category: 'Mission' },
];

const getCategoryClass = (category: Event['category']) => {
    switch (category) {
        case 'Mission': return 'bg-blue-500';
        case 'Formation': return 'bg-green-500';
        case 'Collecte': return 'bg-red-500';
        case 'Réunion': return 'bg-yellow-500';
    }
};

export default function CalendarPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const selectedDayEvents = React.useMemo(() => {
        return date ? events.filter(event => event.date.toDateString() === date.toDateString()) : [];
    }, [date]);

    const monthEvents = React.useMemo(() => {
        return events
            .filter(e => e.date.getMonth() === currentMonth.getMonth() && e.date.getFullYear() === currentMonth.getFullYear())
            .sort((a,b) => a.date.getTime() - b.date.getTime())
    }, [currentMonth]);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold">Calendrier</h1>
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
                                                <div key={event.title} className="flex items-center gap-1.5 w-full">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", getCategoryClass(event.category))}></div>
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
                                {date ? date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }) : '...'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 h-[30rem] overflow-y-auto">
                           {(selectedDayEvents.length > 0 ? selectedDayEvents : monthEvents).map(event => (
                                <div key={event.title} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center bg-muted text-muted-foreground rounded-md p-2 w-16">
                                        <span className="text-xs uppercase">{event.date.toLocaleString('fr-FR', { month: 'short' })}</span>
                                        <span className="text-lg font-bold">{event.date.getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{event.title}</h4>
                                        <Badge variant="secondary" className={cn("mt-1 text-xs", getCategoryClass(event.category), "text-white")}>{event.category}</Badge>
                                    </div>
                                </div>
                            ))}
                             {monthEvents.length === 0 && (
                                <p className="text-muted-foreground text-sm text-center py-8">Aucun évènement pour ce mois.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

