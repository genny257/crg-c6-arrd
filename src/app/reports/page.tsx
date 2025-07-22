
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { Report } from "@/types/report";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Mock Data
const mockReports: Report[] = [
    { id: '1', title: 'Rapport Annuel 2023', date: '2024-01-15T10:00:00Z', fileUrl: 'https://example.com/report1.pdf', visible: true },
    { id: '2', title: 'Rapport Financier T1 2024', date: '2024-04-10T10:00:00Z', fileUrl: 'https://example.com/report2.pdf', visible: true },
    { id: '3', title: 'Brouillon Rapport T2 2024', date: '2024-07-05T10:00:00Z', fileUrl: 'https://example.com/report3.pdf', visible: false },
];


export default function ReportsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchReports = React.useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with API call to /api/reports
      const reportsData = isAdmin ? mockReports : mockReports.filter(r => r.visible);
        
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
  }, [isAdmin, toast]);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-headline font-bold">Rapports</h2>
                <p className="text-muted-foreground">Consultez nos rapports d'activité et financiers.</p>
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
            <CardContent className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre du rapport</TableHead>
                            <TableHead className="hidden md:table-cell w-[200px] text-right">Date de publication</TableHead>
                            {isAdmin && <TableHead className="w-[120px] text-center">Statut</TableHead>}
                            <TableHead className="w-[120px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                                    {isAdmin && <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>}
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id} className={isAdmin && !report.visible ? 'bg-muted/50' : ''}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {report.title}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">{format(new Date(report.date), "d MMMM yyyy", { locale: fr })}</TableCell>
                                     {isAdmin && (
                                        <TableCell className="text-center">
                                            <span className={`text-xs font-semibold ${report.visible ? 'text-green-600' : 'text-amber-600'}`}>
                                                {report.visible ? 'Visible' : 'Masqué'}
                                            </span>
                                        </TableCell>
                                    )}
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                          <a href={report.fileUrl} download target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Télécharger
                                          </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                         {!loading && reports.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={isAdmin ? 4 : 3} className="text-center py-8 text-muted-foreground">
                                    Aucun rapport à afficher pour le moment.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
