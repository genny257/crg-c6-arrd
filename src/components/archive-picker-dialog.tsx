
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { ArchiveItem } from "@/types/archive";
import { FileIcon } from "@/components/file-icon";
import { Folder, FileSearch, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ArchivePickerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (file: ArchiveItem) => void;
}

export const ArchivePickerDialog = ({
  isOpen,
  onOpenChange,
  onFileSelect,
}: ArchivePickerDialogProps) => {
  const [items, setItems] = React.useState<ArchiveItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = React.useState<{ id: string | null; name: string }[]>([{ id: null, name: "Archives" }]);
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchItems = React.useCallback(async (folderId: string | null) => {
    setLoading(true);
    if (!token) {
        setLoading(false);
        return;
    };
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/archive`);
        if (folderId) {
            url.searchParams.append('parentId', folderId);
        }
        
        const response = await fetch(url.toString(), { 
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Erreur lors de la récupération des fichiers.");
        
        const data = await response.json();
        setItems(data);
    } catch (error) {
      console.error("Error fetching archive items:", error);
      toast({ title: "Erreur", description: "Impossible de charger les archives.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast, token]);

  React.useEffect(() => {
    if (isOpen) {
        fetchItems(currentFolderId);
    }
  }, [currentFolderId, fetchItems, isOpen]);

  const handleItemClick = (item: ArchiveItem) => {
    if (item.type === 'FOLDER') {
      setCurrentFolderId(item.id);
      setBreadcrumbs(prev => [...prev, { id: item.id, name: item.name }]);
    } else {
      onFileSelect(item);
    }
  };

  const navigateToBreadcrumb = (crumbIndex: number) => {
    const crumb = breadcrumbs[crumbIndex];
    if (crumb) {
        setCurrentFolderId(crumb.id);
        setBreadcrumbs(breadcrumbs.slice(0, crumbIndex + 1));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Sélectionner un fichier</DialogTitle>
          <DialogDescription>
            Naviguez dans vos archives et sélectionnez le rapport que vous souhaitez publier.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
             <div className="text-sm text-muted-foreground mb-2">
                {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id || 'root'}>
                    {index > 0 && <span className="mx-1">/</span>}
                    <button
                    onClick={() => navigateToBreadcrumb(index)}
                    className="hover:underline disabled:no-underline disabled:cursor-default"
                    disabled={index === breadcrumbs.length - 1}
                    >
                    {crumb.name}
                    </button>
                </React.Fragment>
                ))}
            </div>
            <div className="rounded-lg border h-64 overflow-y-auto p-2">
                {loading ? (
                    <div className="space-y-2">
                         {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                ) : items.length > 0 ? (
                    items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className="flex items-center p-2 rounded-md hover:bg-accent cursor-pointer"
                        >
                            <FileIcon type={item.type} className="h-5 w-5 mr-3" />
                            <span className="flex-1 truncate">{item.name}</span>
                            {item.type !== 'FOLDER' && (
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onFileSelect(item); }}>
                                    Sélectionner
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground">
                        <Folder className="h-12 w-12 mb-2"/>
                        <p>Ce dossier est vide.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export const SelectedFileDisplay = ({ fileUrl, onSelectFile }: { fileUrl?: string; onSelectFile: () => void }) => {
    return (
        <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
                {fileUrl ? (
                    <>
                        <FileSearch className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">{fileUrl.split('/').pop()}</span>
                    </>
                ) : (
                    <span className="text-sm text-muted-foreground">Aucun fichier sélectionné</span>
                )}
            </div>
            <Button type="button" variant="outline" onClick={onSelectFile}>
                Parcourir les archives
            </Button>
        </div>
    );
};
