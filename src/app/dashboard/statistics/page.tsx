
"use client";

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2, Eye, PlusCircle, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnnualStat } from "@/types/stats";

export default function StatisticsPage() {
    const { user, token, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [stats, setStats] = React.useState<AnnualStat[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [editingStat, setEditingStat] = React.useState<Partial<AnnualStat> | null>(null);

    const fetchStats = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/annual-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch stats");
            const data = await response.json();
            setStats(data);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les statistiques annuelles.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    React.useEffect(() => {
        if (!authLoading && user) {
            fetchStats();
        } else if (!authLoading && !user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router, fetchStats]);

    const handleSave = async (stat: Partial<AnnualStat>) => {
        setIsSaving(true);
        const isNew = !stat.id;
        const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/annual-stats` : `${process.env.NEXT_PUBLIC_API_URL}/annual-stats/${stat.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(stat)
            });
            if (!response.ok) throw new Error("L'enregistrement a échoué.");
            toast({ title: "Succès", description: "Statistiques enregistrées." });
            setEditingStat(null);
            fetchStats();
        } catch (error) {
            toast({ title: "Erreur", description: "L'enregistrement a échoué.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/annual-stats/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("La suppression a échoué.");
            toast({ title: "Succès", description: "Statistique supprimée." });
            fetchStats();
        } catch (error) {
            toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive" });
        }
    }
    
    const handleToggleVisibility = async (stat: AnnualStat) => {
        await handleSave({ id: stat.id, isVisible: !stat.isVisible });
    };
    
    if (authLoading) return <div>Chargement...</div>;
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-headline font-bold">Statistiques Annuelles</h1>
                 <Button onClick={() => setEditingStat({ year: new Date().getFullYear(), isVisible: true })}>
                     <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une année
                 </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Historique des statistiques</CardTitle>
                    <CardDescription>Gérez les données d'impact affichées publiquement sur la page d'accueil.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Année</TableHead>
                                <TableHead className="text-center">Visible</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={3}><Skeleton className="h-12 w-full"/></TableCell></TableRow>
                            ) : (
                                stats.map(stat => (
                                    <TableRow key={stat.id}>
                                        <TableCell className="font-medium">{stat.year}</TableCell>
                                        <TableCell className="text-center">
                                            <Switch
                                                checked={stat.isVisible}
                                                onCheckedChange={() => handleToggleVisibility(stat)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => setEditingStat(stat)}><Edit className="mr-2 h-4 w-4"/>Modifier</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(stat.id)}><Trash2 className="mr-2 h-4 w-4"/>Supprimer</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {editingStat && (
                <StatEditor
                    key={editingStat.id || 'new'}
                    stat={editingStat}
                    onSave={handleSave}
                    onCancel={() => setEditingStat(null)}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
}

const StatEditor = ({ stat, onSave, onCancel, isSaving }: { stat: Partial<AnnualStat>, onSave: (data: any) => void, onCancel: () => void, isSaving: boolean }) => {
    const [formData, setFormData] = React.useState(stat);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };
    
    const fields: (keyof AnnualStat)[] = ['bases', 'agents', 'firstAidGraduates', 'assistedHouseholds', 'sensitizedPeople', 'condomsDistributed'];
    const labels: Record<string, string> = {
        bases: 'Bases Communautaires',
        agents: 'Agents de Santé',
        firstAidGraduates: 'Personnes Formées (Secourisme)',
        assistedHouseholds: 'Ménages Assistés',
        sensitizedPeople: 'Personnes Sensibilisées',
        condomsDistributed: 'Préservatifs Distribués'
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{stat.id ? `Modifier les stats pour ${stat.year}` : "Ajouter les stats d'une année"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="year">Année</Label>
                    <Input id="year" name="year" type="number" value={formData.year || ''} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map(field => (
                        <div key={field}>
                            <Label htmlFor={String(field)}>{labels[field]}</Label>
                            <Input id={String(field)} name={String(field)} type="number" value={formData[field as keyof AnnualStat] as number || ''} onChange={handleChange} />
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="ghost" onClick={onCancel}>Annuler</Button>
                <Button onClick={() => onSave(formData)} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Enregistrer
                </Button>
            </CardFooter>
        </Card>
    );
};
