"use client"

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ban, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

type BlockedIP = {
    id: string;
    ip: string;
    reason: string | null;
    createdAt: string;
};

export function IpManagementTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [blockedIps, setBlockedIps] = React.useState<BlockedIP[]>([]);
    const [newIp, setNewIp] = React.useState("");
    const [reason, setReason] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [actionLoading, setActionLoading] = React.useState(false);

    const fetchBlockedIps = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('/api/admin/blocked-ips', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch blocked IPs");
            const data = await response.json();
            setBlockedIps(data);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch blocked IPs.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    React.useEffect(() => {
        fetchBlockedIps();
    }, [fetchBlockedIps]);

    const handleBlockIp = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const response = await fetch('/api/admin/blocked-ips', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip: newIp, reason }),
            });
            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.errors?.[0]?.message || "Failed to block IP");
            }
            toast({ title: "Success", description: `IP ${newIp} has been blocked.` });
            setNewIp("");
            setReason("");
            fetchBlockedIps(); // Refresh list
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnblockIp = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/blocked-ips/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to unblock IP");
            toast({ title: "Success", description: "IP has been unblocked." });
            fetchBlockedIps(); // Refresh list
        } catch (error) {
            toast({ title: "Error", description: "Could not unblock IP.", variant: "destructive" });
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Currently Blocked IPs</CardTitle>
                        <CardDescription>List of all IP addresses that are currently blocked from accessing the API.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Date Blocked</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center h-24">Loading...</TableCell></TableRow>
                                ) : blockedIps.map(ip => (
                                    <TableRow key={ip.id}>
                                        <TableCell className="font-mono">{ip.ip}</TableCell>
                                        <TableCell>{ip.reason || "N/A"}</TableCell>
                                        <TableCell>{format(new Date(ip.createdAt), "dd/MM/yyyy")}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleUnblockIp(ip.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Block a New IP</CardTitle>
                        <CardDescription>Manually add an IP address to the blocklist.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleBlockIp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ip-address">IP Address</Label>
                                <Input 
                                    id="ip-address" 
                                    placeholder="e.g., 192.168.1.1" 
                                    value={newIp}
                                    onChange={(e) => setNewIp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason (Optional)</Label>
                                <Input 
                                    id="reason" 
                                    placeholder="e.g., Spamming"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={actionLoading}>
                                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Ban className="mr-2 h-4 w-4" /> Block IP
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
