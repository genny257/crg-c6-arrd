
"use client"

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type RequestLog = {
    id: string;
    ip: string;
    method: string;
    path: string;
    statusCode: number;
    createdAt: string;
    isThreat: boolean;
};

const columns: ColumnDef<RequestLog>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm:ss", { locale: fr }),
    },
    {
        accessorKey: "ip",
        header: "IP",
    },
    {
        accessorKey: "method",
        header: "Méthode",
        cell: ({ row }) => {
            const method = row.getValue("method") as string;
            const color = method === "GET" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300" :
                          method === "POST" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" :
                          method === "PUT" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300" :
                          method === "DELETE" ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
            return <Badge variant="outline" className={color}>{method}</Badge>
        }
    },
    {
        accessorKey: "path",
        header: "Chemin",
    },
    {
        accessorKey: "statusCode",
        header: "Statut",
         cell: ({ row }) => {
            const status = row.getValue("statusCode") as number;
            const color = status >= 500 ? "bg-red-500" :
                          status >= 400 ? "bg-yellow-500" :
                          status >= 300 ? "bg-blue-500" :
                          "bg-green-500";
            return <Badge className={color}>{status}</Badge>
        }
    },
    {
        accessorKey: "isThreat",
        header: "Menace",
        cell: ({ row }) => (row.getValue("isThreat") ? <Badge variant="destructive">Oui</Badge> : "Non"),
    },
];

export function TrafficLogTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [data, setData] = React.useState<RequestLog[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const pageSize = 15;

    React.useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/traffic?page=${pageIndex + 1}&limit=${pageSize}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch traffic logs");
                const result = await response.json();
                setData(result.data);
                setPageCount(Math.ceil(result.total / pageSize));
            } catch (error) {
                toast({ title: "Error", description: "Could not fetch traffic logs.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, pageIndex, toast]);

    return (
        <DataTable
            columns={columns}
            data={data}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            loading={loading}
        />
    );
}
