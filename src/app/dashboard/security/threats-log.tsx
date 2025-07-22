"use client"

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// This would be in a types file, e.g., src/types/security.ts
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
        cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm:ss"),
    },
    {
        accessorKey: "ip",
        header: "IP",
    },
    {
        accessorKey: "method",
        header: "Method",
    },
    {
        accessorKey: "path",
        header: "Path",
        cell: ({ row }) => <code className="text-sm">{decodeURIComponent(row.getValue("path"))}</code>
    },
    {
        accessorKey: "isThreat",
        header: "Threat",
        cell: ({ row }) => (row.getValue("isThreat") ? <Badge variant="destructive">Yes</Badge> : "No"),
    },
];

export function ThreatsLogTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [data, setData] = React.useState<RequestLog[]>([]);
    const [pageCount, setPageCount] = React.useState(0);
    const [pageIndex, setPageIndex] = React.useState(0);
    const pageSize = 15;

    React.useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const response = await fetch(`/api/admin/threats?page=${pageIndex + 1}&limit=${pageSize}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch threat logs");
                const result = await response.json();
                setData(result.data);
                setPageCount(Math.ceil(result.total / pageSize));
            } catch (error) {
                toast({ title: "Error", description: "Could not fetch threat logs.", variant: "destructive" });
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
        />
    );
}
