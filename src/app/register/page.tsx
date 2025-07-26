
import * as React from "react";
import { RegisterClientPage } from "./client-page";

// Helper function to fetch data from a given endpoint on the server side
async function fetchList(endpoint: string): Promise<string[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`);
        if (!res.ok) {
            console.error(`Failed to fetch ${endpoint}: ${res.statusText}`);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

export default async function RegisterPage() {
    const [
        nationalities,
        educationLevels,
        professions,
        skills,
    ] = await Promise.all([
        fetchList('nationalities'),
        fetchList('educationLevels'),
        fetchList('professions'),
        fetchList('skills'),
    ]);

    return (
        <RegisterClientPage
            nationalities={nationalities}
            educationLevels={educationLevels}
            professions={professions}
            skills={skills}
        />
    );
}
