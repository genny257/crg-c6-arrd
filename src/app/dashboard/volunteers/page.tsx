import * as React from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy, where, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserPlus, MoreHorizontal, Search, ArrowDownUp, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminDb } from "@/lib/firebase/admin";
import type { Volunteer } from "@/types/volunteer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cells, professionsList, skillsList as allSkillsGroups } from "@/lib/locations";
import Link from "next/link";
import {VolunteersClientPage} from "./client-page";

async function getVolunteers(): Promise<Volunteer[]> {
    if (!adminDb) {
        console.error("Firebase Admin DB is not initialized.");
        return [];
    }
    try {
        const q = query(collection(adminDb, "volunteers"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const volunteersData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Firestore Timestamps need to be converted to serializable format (ISO string)
            const createdAt = (data.createdAt as Timestamp)?.toDate()?.toISOString() ?? new Date().toISOString();
            return { 
                id: doc.id, 
                ...data,
                createdAt: createdAt,
                // Ensure other potential timestamps are handled
                birthDate: (data.birthDate instanceof Timestamp) ? data.birthDate.toDate().toISOString() : data.birthDate,
            } as Volunteer
        });
        return volunteersData;
    } catch (error) {
        console.error("Error fetching volunteers from server: ", error);
        return [];
    }
}


export default async function VolunteersPage() {
    const volunteers = await getVolunteers();

    const allSkills = Array.from(new Set(volunteers.flatMap(v => v.skills || []))).sort();
    const allProfessions = Array.from(new Set(volunteers.map(v => v.profession).filter(Boolean) as string[])).sort();

    return (
        <VolunteersClientPage 
            initialVolunteers={volunteers}
            allSkills={allSkills}
            allProfessions={allProfessions}
        />
    );
}