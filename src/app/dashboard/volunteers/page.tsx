
import * as React from "react";
import type { Volunteer } from "@/types/volunteer";
import { VolunteersClientPage } from "./client-page";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

// Helper to safely fetch data and handle errors
async function getVolunteers(token: string | undefined): Promise<Volunteer[]> {
    if (!token) return [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteers`, { 
            cache: 'no-store',
            headers: { 'Authorization': `Bearer ${token}` }
        });

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

async function getGenericList(endpoint: string): Promise<string[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, { 
            cache: 'no-store',
        });
        if (!res.ok) {
             console.error(`Failed to fetch ${endpoint}: ${res.statusText}`);
            return [];
        }
        return await res.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

export default async function VolunteersPage() {
    const session: Session | null = await getServerSession();
    const token = session?.user?.apiToken;

    const [volunteers, skills, professions, cells] = await Promise.all([
        getVolunteers(token),
        getGenericList('skills'),
        getGenericList('professions'),
        Promise.resolve(["Nzeng-Ayong Lac", "Nzeng-Ayong Village", "Ondogo", "PK6-PK9", "PK9-Bikélé"]) // This can be fetched if it becomes dynamic
    ]);

    return (
        <VolunteersClientPage 
            initialVolunteers={JSON.parse(JSON.stringify(volunteers))}
            allSkills={skills}
            allProfessions={professions}
            allCells={cells}
        />
    );
}
