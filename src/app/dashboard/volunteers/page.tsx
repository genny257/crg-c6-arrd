
import * as React from "react";
import type { Volunteer } from "@/types/volunteer";
import { VolunteersClientPage } from "./client-page";

async function getVolunteers(): Promise<Volunteer[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteers`, { cache: 'no-store' });

        if (!res.ok) {
            console.error('Failed to fetch volunteers, status:', res.status);
            return [];
        }

        const volunteers = await res.json();
        return volunteers;
    } catch (error) {
        console.error("Could not fetch volunteers:", error);
        return [];
    }
}


export default async function VolunteersPage() {
    const volunteers = await getVolunteers();

    return (
        <VolunteersClientPage 
            initialVolunteers={JSON.parse(JSON.stringify(volunteers))}
        />
    );
}
