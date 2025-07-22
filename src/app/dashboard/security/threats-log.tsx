
"use client"

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

    const handleExport = async () => {
        if (!token) return;
        toast({ title: "Exporting...", description: "Fetching all threats for export." });
        try {
            // Fetch all data without pagination for export
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/threats?limit=99999`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch all threats");
            const result = await response.json();
            
            const dataToExport = result.data.map((log: RequestLog) => ({
                Date: format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss"),
                IP: log.ip,
                Method: log.method,
                Path: decodeURIComponent(log.path),
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Threats");
            XLSX.writeFile(workbook, "threats_log.xlsx");

            toast({ title: "Export Successful", description: "Threats log has been downloaded." });
        } catch (error) {
            toast({ title: "Export Error", description: "Could not export threats log.", variant: "destructive" });
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/threats?page=${pageIndex + 1}&limit=${pageSize}`, {
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
        <>
            <DataTable
                columns={columns}
                data={data}
                pageCount={pageCount}
                pageIndex={pageIndex}
                pageSize={pageSize}
                onPageChange={setPageIndex}
            />
            <div className="flex justify-end mt-4">
                <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export to Excel
                </Button>
            </div>
        </>
    );
}
