
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, HeartHandshake, Percent } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import type { StatsData } from "@/types/stats";
import { subMonths, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data, to be replaced by API call
const getMockStatsData = async (): Promise<StatsData> => {
  return new Promise(resolve => {
    setTimeout(() => {
        const now = new Date();
        const volunteersHistory = Array.from({ length: 6 }, (_, i) => {
            const d = subMonths(now, 5 - i);
            return { name: format(d, 'MMM', { locale: fr }), count: 15 + i * 5 + Math.floor(Math.random() * 5) };
        });
         const donationsHistory = Array.from({ length: 6 }, (_, i) => {
            const d = subMonths(now, 5 - i);
            return { name: format(d, 'MMM', { locale: fr }), total: 100000 + i * 50000 + Math.floor(Math.random() * 20000) };
        });

      resolve({
        keyMetrics: {
          activeVolunteers: 85,
          newVolunteersThisMonth: 8,
          ongoingMissions: 4,
          donationsThisMonth: 250000,
          donationChangePercentage: 15.2,
          engagementRate: 65,
        },
        charts: {
          volunteersHistory,
          donationsHistory,
        }
      });
    }, 1000);
  });
};


export default function AnalyticsPage() {
    const [stats, setStats] = React.useState<StatsData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // TODO: Replace with API call to /api/analytics
                const data = await getMockStatsData();
                setStats(data);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
                toast({ title: "Erreur", description: "Impossible de charger les statistiques.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);

    if (loading || !stats) {
        return <AnalyticsSkeleton />
    }

    const { keyMetrics, charts } = stats;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-headline font-bold">Statistiques</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volontaires Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.activeVolunteers}</div>
            <p className="text-xs text-muted-foreground">+{keyMetrics.newVolunteersThisMonth} ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions en Cours</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.ongoingMissions}</div>
            <p className="text-xs text-muted-foreground">Missions actuellement sur le terrain</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dons ({format(new Date(), 'MMMM', {locale: fr})})</CardTitle>
            <HeartHandshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.donationsThisMonth.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-muted-foreground">
                {keyMetrics.donationChangePercentage >= 0 ? '+' : ''}{keyMetrics.donationChangePercentage.toFixed(1)}% vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.engagementRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Volontaires assignés à une mission</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Évolution des Volontaires</CardTitle>
                <CardDescription>Nombre total de volontaires inscrits par mois.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={charts.volunteersHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false}/>
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" name="Volontaires" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Collecte de Dons Mensuelle</CardTitle>
                <CardDescription>Montant total des dons reçus chaque mois (en FCFA).</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={charts.donationsHistory}>
                         <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${(value as number) / 1000000}M`} />
                        <Tooltip formatter={(value: number) => new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'} />
                        <Bar dataKey="total" fill="hsl(var(--primary))" name="Dons" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

const AnalyticsSkeleton = () => (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-9 w-48" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
      </div>
    </div>
)
