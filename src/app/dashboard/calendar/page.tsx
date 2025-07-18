
"use client"
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";

const events = [
    { date: new Date(2024, 7, 1), title: "Distribution de nourriture" },
    { date: new Date(2024, 7, 20), title: "Campagne de vaccination" },
    { date: new Date(2024, 7, 15), title: "Collecte de sang" },
];

export default function CalendarPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-headline font-bold">Calendrier</h1>
            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2">
                     <CardContent className="p-0">
                         <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="p-0"
                            classNames={{
                                months: "flex flex-col sm:flex-row",
                                month: "space-y-4 p-4",
                                caption: "flex justify-center pt-1 relative items-center",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "h-24 w-full text-center text-sm p-1 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-full w-full p-1 justify-start items-start",
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                            }}
                            components={{
                                DayContent: ({ date, ...props }) => {
                                    const dayEvents = events.filter(event => new Date(event.date).toDateString() === date.toDateString());
                                    return (
                                        <div className="flex flex-col h-full items-start justify-start">
                                            <span>{date.getDate()}</span>
                                            {dayEvents.map(event => (
                                                <div key={event.title} className="bg-primary/20 text-primary-foreground text-xs rounded px-1 mt-1 w-full text-left truncate">
                                                   <span className="text-primary font-medium">{event.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            }}
                        />
                    </CardContent>
                </Card>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Évènements à venir</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {events
                                .filter(e => e.date >= new Date())
                                .sort((a,b) => a.date.getTime() - b.date.getTime())
                                .map(event => (
                                <div key={event.title} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center justify-center bg-muted text-muted-foreground rounded-md p-2 w-16">
                                        <span className="text-xs uppercase">{event.date.toLocaleString('fr-FR', { month: 'short' })}</span>
                                        <span className="text-lg font-bold">{event.date.getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{event.title}</h4>
                                        <p className="text-sm text-muted-foreground">{event.date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
