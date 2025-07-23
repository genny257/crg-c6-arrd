
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from 'date-fns';
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface ThreatLog {
    id: string;
    ip: string;
    method: string;
    path: string;
    statusCode: number;
    createdAt: string;
}

const columns: ColumnDef<ThreatLog>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm:ss')
    },
    { accessorKey: "ip", header: "IP" },
    { accessorKey: "method", header: "Méthode" },
    { accessorKey: "path", header: "Chemin" },
    { 
        accessorKey: "statusCode", 
        header: "Statut",
        cell: () => (
             <Badge variant="destructive">Bloqué</Badge>
        )
    },
];

export function ThreatsLogTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [threats, setThreats] = React.useState<ThreatLog[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(20);
    const [loading, setLoading] = React.useState(true);

    const fetchThreats = React.useCallback(async (page: number) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/threats?page=${page + 1}&limit=${pageSize}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch threats");
            const data = await response.json();
            setThreats(data.data);
            setPageCount(Math.ceil(data.total / pageSize));
            setPageIndex(data.page - 1);
        } catch (error) {
            console.error("Error fetching threats:", error);
            toast({ title: "Erreur", description: "Impossible de charger le journal des menaces.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast, pageSize]);

     React.useEffect(() => {
        fetchThreats(0);
    }, [fetchThreats]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Journal des Menaces de Sécurité</CardTitle>
                 <CardDescription>Liste des requêtes potentiellement malveillantes qui ont été détectées.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={threats}
                    pageCount={pageCount}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPageChange={fetchThreats}
                    loading={loading}
                />
            </CardContent>
        </Card>
    );
}
