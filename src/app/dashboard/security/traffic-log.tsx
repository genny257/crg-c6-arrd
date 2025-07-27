
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format } from 'date-fns';
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface TrafficLog {
    id: string;
    ip: string;
    method: string;
    path: string;
    statusCode: number;
    createdAt: string;
}

const getStatusColor = (statusCode: number) => {
    if (statusCode >= 500) return 'bg-red-500';
    if (statusCode >= 400) return 'bg-yellow-500';
    if (statusCode >= 300) return 'bg-blue-500';
    if (statusCode >= 200) return 'bg-green-500';
    return 'bg-gray-500';
}

const columns: ColumnDef<TrafficLog>[] = [
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
        cell: ({ row }) => (
            <Badge className={`${getStatusColor(row.original.statusCode)} text-white hover:${getStatusColor(row.original.statusCode)}`}>{row.original.statusCode}</Badge>
        )
    },
];

export function TrafficLogTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [logs, setLogs] = React.useState<TrafficLog[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(20);
    const [loading, setLoading] = React.useState(true);

    const fetchLogs = React.useCallback(async (page: number) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/traffic?page=${page + 1}&limit=${pageSize}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch traffic logs");
            const data = await response.json();
            setLogs(data.data);
            setPageCount(Math.ceil(data.total / pageSize));
            setPageIndex(data.page - 1);
        } catch (error) {
            console.error("Error fetching traffic logs:", error);
            toast({ title: "Erreur", description: "Impossible de charger le journal du trafic.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast, pageSize]);

    React.useEffect(() => {
        fetchLogs(0);
    }, [fetchLogs]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Journal du Trafic API</CardTitle>
                <CardDescription>Liste paginée de toutes les requêtes reçues par le serveur.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={logs}
                    pageCount={pageCount}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPageChange={fetchLogs}
                    loading={loading}
                />
            </CardContent>
        </Card>
    );
}