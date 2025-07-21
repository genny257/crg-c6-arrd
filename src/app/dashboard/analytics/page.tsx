
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, HeartHandshake, Percent } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useToast } from "@/hooks/use-toast";
import type { StatsData, MonthlyData } from "@/types/stats";
import { subMonths, format, getMonth, getYear, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

async function getStatsData(db: any): Promise<StatsData> {
    const volunteersSnap = await getDocs(collection(db, "volunteers"));
    const activeMissionsSnap = await getDocs(query(collection(db, "missions"), where("status", "==", "En cours")));
    const donationsSnap = await getDocs(collection(db, "donations"));

    const now = new Date();
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));

    const volunteersByMonth: MonthlyData[] = Array.from({ length: 6 }, (_, i) => {
        const d = subMonths(now, 5 - i);
        return { name: format(d, 'MMM', { locale: fr }), count: 0 };
    });

    const donationsByMonth: MonthlyData[] = Array.from({ length: 6 }, (_, i) => {
        const d = subMonths(now, 5 - i);
        return { name: format(d, 'MMM', { locale: fr }), total: 0 };
    });
    
    let totalDonationsLastMonth = 0;
    const lastMonth = subMonths(now, 1);
    const startOfLastMonth = startOfMonth(lastMonth);
    const endOfLastMonth = startOfMonth(now);

    volunteersSnap.forEach(doc => {
        const data = doc.data();
        const createdAt = (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate() : new Date(data.createdAt);
        if (createdAt >= sixMonthsAgo) {
            const monthIndex = (getMonth(createdAt) - getMonth(sixMonthsAgo) + 12) % 12;
            if (volunteersByMonth[monthIndex]) {
                 volunteersByMonth[monthIndex].count++;
            }
        }
    });

    // Accumulate counts for volunteers
    for (let i = 1; i < volunteersByMonth.length; i++) {
        volunteersByMonth[i].count += volunteersByMonth[i - 1].count;
    }
    const totalVolunteersLastMonth = volunteersByMonth[4]?.count ?? 0;
    const newVolunteersThisMonth = volunteersByMonth[5].count - totalVolunteersLastMonth;

    let totalDonationsThisMonth = 0;

    donationsSnap.forEach(doc => {
        const data = doc.data();
        const donationDate = (data.date as any)?.toDate ? (data.date as any).toDate() : new Date(data.date);
        
        if (donationDate >= sixMonthsAgo) {
             const month = getMonth(donationDate);
             const year = getYear(donationDate);
             const currentYear = getYear(now);

            // Find the correct month index in our 6-month array
             for (let i = 0; i < 6; i++) {
                const d = subMonths(now, 5 - i);
                if (getMonth(d) === month && getYear(d) === year) {
                     if (donationsByMonth[i]) {
                        donationsByMonth[i].total = (donationsByMonth[i].total || 0) + data.amount;
                    }
                    break;
                }
            }
        }
        
        if (getYear(donationDate) === getYear(now) && getMonth(donationDate) === getMonth(now)) {
            totalDonationsThisMonth += data.amount;
        }
        if (donationDate >= startOfLastMonth && donationDate < endOfLastMonth) {
            totalDonationsLastMonth += data.amount;
        }
    });
    
    const donationChangePercentage = totalDonationsLastMonth > 0
        ? ((totalDonationsThisMonth - totalDonationsLastMonth) / totalDonationsLastMonth) * 100
        : totalDonationsThisMonth > 0 ? 100 : 0;

    const activeVolunteersCount = volunteersSnap.docs.filter(d => d.data().status === 'Actif').length;
    const allMissionsSnap = await getDocs(collection(db, "missions"));
    const assignedVolunteers = new Set();
    allMissionsSnap.forEach(missionDoc => {
        const participants = missionDoc.data().participants || [];
        participants.forEach((p: string) => assignedVolunteers.add(p));
    });

    const engagementRate = activeVolunteersCount > 0 ? (assignedVolunteers.size / activeVolunteersCount) * 100 : 0;

    return {
        keyMetrics: {
            activeVolunteers: activeVolunteersCount,
            newVolunteersThisMonth,
            ongoingMissions: activeMissionsSnap.size,
            donationsThisMonth: totalDonationsThisMonth,
            donationChangePercentage,
            engagementRate,
        },
        charts: {
            volunteersHistory: volunteersByMonth,
            donationsHistory: donationsByMonth,
        }
    };
}


export default function AnalyticsPage() {
    const [stats, setStats] = React.useState<StatsData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        const fetchData = async () => {
            if (!db) return;
            setLoading(true);
            try {
                const data = await getStatsData(db);
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
