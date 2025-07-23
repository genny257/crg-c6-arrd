
import * as React from "react";
import type { Volunteer } from "@/types/volunteer";
import { VolunteersClientPage } from "./client-page";
import { getServerSession } from "next-auth";

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

async function getGenericList(name: string): Promise<string[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${name}`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        return [];
    }
}


export default async function VolunteersPage() {
    const session = await getServerSession();
    // @ts-ignore
    const token = session?.user?.apiToken;
    const [volunteers, skills, professions, cells] = await Promise.all([
        getVolunteers(token),
        getGenericList('skills'),
        getGenericList('professions'),
        Promise.resolve(["Nzeng-Ayong Lac", "Nzeng-Ayong Village", "Ondogo", "PK6-PK9", "PK9-Bikélé"])
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
