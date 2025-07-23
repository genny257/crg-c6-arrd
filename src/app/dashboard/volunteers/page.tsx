
import * as React from "react";
import type { Volunteer } from "@/types/volunteer";
import { VolunteersClientPage } from "./client-page";
import { headers } from "next/headers";
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


export default async function VolunteersPage() {
    const session = await getServerSession();
    // @ts-ignore
    const token = session?.user?.apiToken;
    const volunteers = await getVolunteers(token);

    return (
        <VolunteersClientPage 
            initialVolunteers={JSON.parse(JSON.stringify(volunteers))}
        />
    );
}
