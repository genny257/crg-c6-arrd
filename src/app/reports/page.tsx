
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

export default function ReportsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchReports = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let reportsData: Report[] = await response.json();
      
      // On public page, only show visible reports
      reportsData = reportsData.filter(r => r.visible);
        
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
  }, [toast]);

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
                            <TableHead className="w-[150px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell className="hidden md:table-cell text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-10 w-32 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        {report.title}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-right">{format(new Date(report.createdAt), "d MMMM yyyy", { locale: fr })}</TableCell>
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
                                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
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
