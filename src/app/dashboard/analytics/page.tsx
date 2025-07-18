
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, HeartHandshake, DollarSign } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const volunteersData = [
  { name: 'Jan', count: 120 },
  { name: 'Fév', count: 150 },
  { name: 'Mar', count: 170 },
  { name: 'Avr', count: 210 },
  { name: 'Mai', count: 250 },
  { name: 'Jui', count: 280 },
];

const donationsData = [
  { month: 'Janvier', total: 1500000 },
  { month: 'Février', total: 1800000 },
  { month: 'Mars', total: 2200000 },
  { month: 'Avril', total: 1900000 },
  { month: 'Mai', total: 2500000 },
  { month: 'Juin', total: 3000000 },
];

export default function AnalyticsPage() {
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
            <div className="text-2xl font-bold">280</div>
            <p className="text-xs text-muted-foreground">+30 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions en Cours</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 planifiées pour la semaine prochaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dons (Juin)</CardTitle>
            <HeartHandshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,000,000 FCFA</div>
            <p className="text-xs text-muted-foreground">+20% par rapport à Mai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'engagement</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Participation aux missions</p>
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
                    <BarChart data={volunteersData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
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
                    <BarChart data={donationsData}>
                         <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
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
