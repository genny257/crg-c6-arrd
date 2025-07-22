"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from 'date-fns';

interface TrafficLog {
    id: string;
    ip: string;
    method: string;
    path: string;
    statusCode: number;
    createdAt: string;
}

export function TrafficLogTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [logs, setLogs] = React.useState<TrafficLog[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLogs = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/traffic`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch traffic logs");
                const data = await response.json();
                setLogs(data);
            } catch (error) {
                console.error("Error fetching traffic logs:", error);
                toast({ title: "Erreur", description: "Impossible de charger le journal du trafic.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token, toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Journal du Trafic API</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? <p>Chargement...</p> : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead>Méthode</TableHead>
                                <TableHead>Chemin</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                                    <TableCell>{log.ip}</TableCell>
                                    <TableCell>{log.method}</TableCell>
                                    <TableCell>{log.path}</TableCell>
                                    <TableCell>{log.statusCode}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}