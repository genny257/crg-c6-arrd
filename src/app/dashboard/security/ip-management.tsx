
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";

interface BlockedIP {
    id: string;
    ip: string;
    reason?: string;
    createdAt: string;
}

export function IpManagementTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [ipAddress, setIpAddress] = React.useState("");
    const [reason, setReason] = React.useState("");
    const [blockedIps, setBlockedIps] = React.useState<BlockedIP[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [blocking, setBlocking] = React.useState(false);

    const fetchBlockedIps = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blocked-ips`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch blocked IPs");
            const data = await response.json();
            setBlockedIps(data);
        } catch (error) {
            console.error("Error fetching blocked IPs:", error);
            toast({ title: "Erreur", description: "Impossible de charger les adresses IP bloquées.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    React.useEffect(() => {
        fetchBlockedIps();
    }, [fetchBlockedIps]);

    const handleBlockIp = async () => {
        if (!ipAddress) {
             toast({ title: "Erreur", description: "L'adresse IP est requise.", variant: "destructive" });
             return;
        }
        setBlocking(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blocked-ips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ip: ipAddress, reason })
            });
            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || "Failed to block IP");
            }
            toast({ title: "Succès", description: `L'adresse IP ${ipAddress} a été bloquée.` });
            setIpAddress("");
            setReason("");
            fetchBlockedIps();
        } catch (error: any) {
            console.error("Error blocking IP:", error);
            toast({ title: "Erreur", description: error.message || "Impossible de bloquer l'adresse IP.", variant: "destructive" });
        } finally {
            setBlocking(false);
        }
    };
    
    const handleUnblockIp = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blocked-ips/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to unblock IP");
            toast({ title: "Succès", description: `L'adresse IP a été débloquée.` });
            fetchBlockedIps();
        } catch (error) {
            console.error("Error unblocking IP:", error);
            toast({ title: "Erreur", description: "Impossible de débloquer l'adresse IP.", variant: "destructive" });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des Adresses IP</CardTitle>
                <CardDescription>Ajoutez ou supprimez manuellement des adresses IP de la liste de blocage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                        placeholder="Adresse IP à bloquer (ex: 192.168.1.1)" 
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        className="flex-grow"
                    />
                     <Input 
                        placeholder="Raison du blocage (optionnel)" 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                         className="flex-grow"
                    />
                    <Button onClick={handleBlockIp} disabled={blocking}>
                        {blocking ? "Blocage..." : "Bloquer l'IP"}
                    </Button>
                </div>
                <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">IPs Actuellement Bloquées</h3>
                    <div className="border rounded-md">
                        {loading ? (
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                         ) : (
                            <ul className="space-y-1 p-2">
                                {blockedIps.length > 0 ? blockedIps.map(ip => (
                                    <li key={ip.id} className="flex justify-between items-center p-2 hover:bg-muted rounded-md text-sm">
                                        <div>
                                            <span className="font-mono">{ip.ip}</span>
                                            {ip.reason && <span className="text-muted-foreground ml-2 italic">- {ip.reason}</span>}
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleUnblockIp(ip.id)} className="h-8 w-8">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </li>
                                )) : (
                                    <p className="text-center text-muted-foreground p-4">Aucune adresse IP n'est bloquée manuellement.</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
