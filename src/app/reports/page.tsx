
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, MoreHorizontal, Eye, Pencil, Trash2, PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const reports = [
    {
        title: "Rapport d'Activité Annuel 2023",
        date: "15 Février 2024",
        fileUrl: "#",
        visible: true,
    },
    {
        title: "Rapport Financier Semestriel - S1 2024",
        date: "30 Juillet 2024",
        fileUrl: "#",
        visible: true,
    },
    {
        title: "Rapport de Mission - Inondations Libreville",
        date: "20 Juillet 2024",
        fileUrl: "#",
        visible: true,
    },
    {
        title: "Bilan de la Campagne de Vaccination",
        date: "05 Juin 2024",
        fileUrl: "#",
        visible: false,
    }
];

export default function ReportsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-headline font-bold">Rapports</h2>
                <p className="text-muted-foreground">Consultez nos rapports d'activité et financiers.</p>
            </div>

             {isAdmin && (
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau rapport
                </Button>
             )}

        </div>
        <Card>
            <CardContent className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre du rapport</TableHead>
                            <TableHead className="w-[200px] text-right">Date de publication</TableHead>
                            <TableHead className="w-[120px] text-center">Statut</TableHead>
                            <TableHead className="w-[120px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.title} className={!report.visible ? 'bg-muted/50' : ''}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {report.title}
                                </TableCell>
                                <TableCell className="text-right">{report.date}</TableCell>
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
                                                 <a href={report.fileUrl} download className="flex items-center">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    <span>Télécharger</span>
                                                 </a>
                                            </DropdownMenuItem>
                                            {isAdmin && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        <span>Modifier</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>{report.visible ? 'Masquer' : 'Afficher'}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        <span>Supprimer</span>
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
