
import * as React from "react";
import type { Volunteer } from "@/types/volunteer";
import { VolunteersClientPage } from "./client-page";

async function getVolunteers(): Promise<Volunteer[]> {
    try {
        // In a real app, you'd fetch from your API
        // For now, let's assume this is your API endpoint
        const res = await fetch('http://localhost:3001/api/volunteers', { cache: 'no-store' });

        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch volunteers');
        }

        const volunteers = await res.json();
        return volunteers;
    } catch (error) {
        console.error("Could not fetch volunteers:", error);
        // In case of error, return an empty array to prevent the page from crashing.
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
