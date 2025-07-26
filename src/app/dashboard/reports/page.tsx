
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, MoreHorizontal, Eye, Pencil, Trash2, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { Report } from "@/types/report";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ReportsPage() {
  const { user, loading: authLoading, token } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchReports = React.useCallback(async () => {
    if (!token) {
        setLoading(false);
        return;
    };
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      const reportsData: Report[] = await response.json();
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports: ", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rapports.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, token]);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDelete = async (id: string) => {
    if (!id || !token) return;
    const originalReports = [...reports];
    setReports(reports.filter(r => r.id !== id));
    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("La suppression a échoué.");
        toast({ title: "Succès", description: "Le rapport a été supprimé." });
    } catch (error) {
        setReports(originalReports);
        toast({ title: "Erreur", description: "La suppression a échoué.", variant: "destructive" });
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    if (!id || !token) return;
    
    const originalReports = [...reports];
    setReports(reports.map(r => r.id === id ? { ...r, visible: !r.visible } : r));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ visible: !currentVisibility })
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
        throw new Error("La mise à jour a échoué.");
      }
      toast({ title: "Succès", description: `Le rapport est maintenant ${!currentVisibility ? 'visible' : 'masqué'}.` });
    } catch (error) {
        setReports(originalReports);
        toast({ title: "Erreur", description: "La mise à jour de la visibilité a échoué.", variant: "destructive" });
    }
  };
  
  if (authLoading) return <div>Chargement...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-headline font-bold">Gestion des Rapports</h2>
                <p className="text-muted-foreground">Ajoutez, modifiez et gérez la visibilité des rapports.</p>
            </div>
             {isAdmin && (
                <Button asChild>
                    <Link href="/dashboard/reports/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nouveau rapport
                    </Link>
                </Button>
             )}
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Liste des Rapports</CardTitle>
                <CardDescription>Consultez la liste de tous les rapports publiés et en brouillon.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre du rapport</TableHead>
                            <TableHead className="hidden md:table-cell w-[200px] text-right">Date de publication</TableHead>
                            <TableHead className="w-[120px] text-center">Statut</TableHead>
                            <TableHead className="w-[120px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id} className={!report.visible ? 'bg-muted/50' : ''}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {report.title}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">{format(new Date(report.createdAt), "d MMMM yyyy", { locale: fr })}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`text-xs font-semibold ${report.visible ? 'text-green-600' : 'text-amber-600'}`}>
                                            {report.visible ? 'Visible' : 'Masqué'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                     <a href={report.fileUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        <span>Télécharger</span>
                                                     </a>
                                                </DropdownMenuItem>
                                                {isAdmin && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/reports/${report.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toggleVisibility(report.id, report.visible)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            <span>{report.visible ? 'Masquer' : 'Afficher'}</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(report.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Supprimer</span>
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                         {!loading && reports.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Aucun rapport trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
