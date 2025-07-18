
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const reports = [
    {
        title: "Rapport d'Activité Annuel 2023",
        date: "15 Février 2024",
        fileUrl: "#"
    },
    {
        title: "Rapport Financier Semestriel - S1 2024",
        date: "30 Juillet 2024",
        fileUrl: "#"
    },
    {
        title: "Rapport de Mission - Inondations Libreville",
        date: "20 Juillet 2024",
        fileUrl: "#"
    },
    {
        title: "Bilan de la Campagne de Vaccination",
        date: "05 Juin 2024",
        fileUrl: "#"
    }
];

export default function ReportsPage() {

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-headline font-bold">Rapports</h2>
                <p className="text-muted-foreground">Consultez nos rapports d'activité et financiers.</p>
            </div>
             
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau rapport
            </Button>
             
        </div>
        <Card>
            <CardContent className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre du rapport</TableHead>
                            <TableHead className="w-[200px] text-right">Date de publication</TableHead>
                            <TableHead className="w-[120px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.title}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {report.title}
                                </TableCell>
                                <TableCell className="text-right">{report.date}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={report.fileUrl} download>
                                            <Download className="mr-2 h-3 w-3" />
                                            Télécharger
                                        </a>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
