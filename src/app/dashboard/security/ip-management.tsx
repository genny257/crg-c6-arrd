"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function IpManagementTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [ipAddress, setIpAddress] = React.useState("");
    const [blockedIps, setBlockedIps] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchBlockedIps = React.useCallback(async () => {
        if (!token) return;
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
        if (!ipAddress) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/block-ip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ip: ipAddress })
            });
            if (!response.ok) throw new Error("Failed to block IP");
            toast({ title: "Succès", description: `L'adresse IP ${ipAddress} a été bloquée.` });
            setIpAddress("");
            fetchBlockedIps();
        } catch (error) {
            console.error("Error blocking IP:", error);
            toast({ title: "Erreur", description: "Impossible de bloquer l'adresse IP.", variant: "destructive" });
        }
    };
    
    const handleUnblockIp = async (ip: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/unblock-ip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ip })
            });
            if (!response.ok) throw new Error("Failed to unblock IP");
            toast({ title: "Succès", description: `L'adresse IP ${ip} a été débloquée.` });
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
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Entrez une adresse IP à bloquer" 
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                    />
                    <Button onClick={handleBlockIp}>Bloquer</Button>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">IPs Actuellement Bloquées</h3>
                    {loading ? <p>Chargement...</p> : (
                        <ul className="space-y-2">
                            {blockedIps.map(ip => (
                                <li key={ip} className="flex justify-between items-center p-2 border rounded">
                                    <span>{ip}</span>
                                    <Button variant="outline" size="sm" onClick={() => handleUnblockIp(ip)}>Débloquer</Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}