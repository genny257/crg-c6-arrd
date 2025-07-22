"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, BarChart, Ban, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// This would be in a types file, e.g., src/types/security.ts
interface SecurityStats {
    totalRequests: number;
    totalThreats: number;
    totalBlocked: number;
    uniqueVisitors: number;
}

export default function SecurityPage() {
    const { user, token } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    const [stats, setStats] = React.useState<SecurityStats | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Redirect if user is not a superadmin
        if (user && user.role !== 'SUPERADMIN') {
            toast({ title: "Accès non autorisé", description: "Vous n'avez pas les droits pour voir cette page.", variant: "destructive" });
            router.push('/dashboard');
            return;
        }

        const fetchStats = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch stats");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching security stats:", error);
                toast({ title: "Erreur", description: "Impossible de charger les statistiques de sécurité.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchStats();
        }
    }, [user, token, router, toast]);

    if (!user || user.role !== 'SUPERADMIN') {
        return <div className="flex items-center justify-center h-full"><p>Redirection...</p></div>;
    }
    
    if (loading) {
        return <SecurityPageSkeleton />;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-headline font-bold">Tableau de Bord de Sécurité</h1>
            </div>

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="traffic">Logs du Trafic</TabsTrigger>
                    <TabsTrigger value="threats">Menaces</TabsTrigger>
                    <TabsTrigger value="ip-management">Gestion des IP</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Visiteurs Uniques (24h)</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.uniqueVisitors ?? 0}</div>
                                <p className="text-xs text-muted-foreground">Adresses IP uniques vues</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Requêtes (24h)</CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalRequests ?? 0}</div>
                                <p className="text-xs text-muted-foreground">Toutes les requêtes API</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Menaces Détectées</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">{stats?.totalThreats ?? 0}</div>
                                <p className="text-xs text-muted-foreground">Tentatives suspectes bloquées</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">IP Bloquées</CardTitle>
                                <Ban className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalBlocked ?? 0}</div>
                                <p className="text-xs text-muted-foreground">IP bannies manuellement</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8">
                        {/* Charts will go here */}
                    </div>
                </TabsContent>

                <TabsContent value="traffic">
                    <p>Tableau des logs du trafic à venir.</p>
                </TabsContent>
                <TabsContent value="threats">
                     <p>Tableau des menaces à venir.</p>
                </TabsContent>
                <TabsContent value="ip-management">
                     <p>Interface de gestion des IP à venir.</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const SecurityPageSkeleton = () => (
    <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-9 w-80" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-3 w-24" />
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);
