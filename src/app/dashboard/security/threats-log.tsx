"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from 'date-fns';

interface ThreatLog {
    id: string;
    ip: string;
    type: string;
    path: string;
    createdAt: string;
}

export function ThreatsLogTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [threats, setThreats] = React.useState<ThreatLog[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchThreats = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/threats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch threats");
                const data = await response.json();
                setThreats(data);
            } catch (error) {
                console.error("Error fetching threats:", error);
                toast({ title: "Erreur", description: "Impossible de charger le journal des menaces.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchThreats();
    }, [token, toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Journal des Menaces de Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? <p>Chargement...</p> : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Adresse IP</TableHead>
                                <TableHead>Type de Menace</TableHead>
                                <TableHead>Chemin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {threats.map((threat) => (
                                <TableRow key={threat.id}>
                                    <TableCell>{format(new Date(threat.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>{threat.ip}</TableCell>
                                    <TableCell>{threat.type}</TableCell>
                                    <TableCell>{threat.path}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}