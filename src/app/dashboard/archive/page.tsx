
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FilePlus2,
  FolderPlus,
  Upload,
  MoreVertical,
  List,
  LayoutGrid,
  Folder,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Pencil,
} from "lucide-react";
import type { ArchiveItem } from "@/types/archive";
import { FileIcon } from "@/components/file-icon";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function ArchivePage() {
  const [items, setItems] = React.useState<ArchiveItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = React.useState<{ id: string | null; name: string }[]>([{ id: null, name: "Archives" }]);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = React.useState(false);
  
  const { toast } = useToast();
  const { user, loading: authLoading, token } = useAuth();
  const router = useRouter();

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
        
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des fichiers.");
        }

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
    if (token) {
        fetchItems(currentFolderId);
    }
  }, [currentFolderId, fetchItems, token]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !token) {
      toast({ title: "Erreur", description: "Le nom du dossier ne peut pas être vide.", variant: "destructive" });
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/archive/folder`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              name: newFolderName,
              parentId: currentFolderId,
          })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "La création du dossier a échoué.");
      }

      toast({ title: "Dossier créé", description: "Le nouveau dossier a été ajouté avec succès." });
      fetchItems(currentFolderId);
    } catch (error: any) {
        console.error("Error creating folder:", error);
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
        setNewFolderName("");
        setIsCreateFolderDialogOpen(false);
    }
  };

  const navigateToFolder = (item: ArchiveItem) => {
    if (item.type !== 'FOLDER') return;
    setCurrentFolderId(item.id);
    setBreadcrumbs(prev => [...prev, { id: item.id, name: item.name }]);
  };

  const navigateToBreadcrumb = (crumbIndex: number) => {
    const crumb = breadcrumbs[crumbIndex];
    if (crumb) {
        setCurrentFolderId(crumb.id);
        setBreadcrumbs(breadcrumbs.slice(0, crumbIndex + 1));
    }
  };

  if (authLoading) return <div>Chargement...</div>;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
     router.push('/login');
     return null;
  }
  
  const visibleItems = items;

  return (
    <div className="flex flex-col h-full gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Archives</h1>
          <nav className="text-sm text-muted-foreground">
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
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setView(view === "grid" ? "list" : "grid")}>
            {view === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>

          <AlertDialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Nouveau
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem onSelect={() => setIsCreateFolderDialogOpen(true)}>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    <span>Nouveau dossier</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileIcon type="DOCUMENT" className="mr-2 h-4 w-4" />
                  <span>Document Word</span>
                </DropdownMenuItem>
                 <DropdownMenuItem>
                  <FileIcon type="SPREADSHEET" className="mr-2 h-4 w-4" />
                  <span>Fichier Excel</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Nouveau Dossier</AlertDialogTitle>
                <AlertDialogDescription>
                  Veuillez entrer un nom pour votre nouveau dossier.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-2 py-4">
                  <Label htmlFor="folder-name">Nom du dossier</Label>
                  <Input 
                    id="folder-name" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                    autoFocus
                  />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateFolder}>Créer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Téléverser
          </Button>
        </div>
      </header>

      <div className="flex-1 rounded-lg border border-dashed p-4">
       {loading ? (
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className="flex flex-col items-center justify-center text-center p-2 rounded-lg">
                    <Skeleton className="w-16 h-16 mb-2" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
       ) : view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {visibleItems.map((item) => (
              <ItemGrid key={item.id} item={item} onNavigate={navigateToFolder}/>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
             {visibleItems.map((item) => (
              <ItemList key={item.id} item={item} onNavigate={navigateToFolder}/>
            ))}
          </div>
        )}
         {!loading && visibleItems.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground">
                <Folder className="h-16 w-16 mb-4"/>
                <p className="font-semibold">Ce dossier est vide</p>
                <p className="text-sm">Glissez-déposez des fichiers ici ou utilisez les boutons ci-dessus.</p>
            </div>
        )}
      </div>
    </div>
  );
}

const ItemGrid = ({ item, onNavigate }: { item: ArchiveItem, onNavigate: (item: ArchiveItem) => void }) => (
  <div 
    className="group relative flex flex-col items-center justify-center text-center p-2 rounded-lg hover:bg-accent cursor-pointer"
    onDoubleClick={() => onNavigate(item)}
  >
    <FileIcon type={item.type} className="w-16 h-16 mb-2" />
    <span className="text-sm font-medium truncate w-full">{item.name}</span>
    <ItemMenu />
  </div>
);

const ItemList = ({ item, onNavigate }: { item: ArchiveItem, onNavigate: (item: ArchiveItem) => void }) => (
    <div 
        className="group relative flex items-center p-2 rounded-lg hover:bg-accent cursor-pointer"
        onDoubleClick={() => onNavigate(item)}
    >
        <FileIcon type={item.type} className="w-6 h-6 mr-4" />
        <span className="text-sm font-medium truncate flex-1">{item.name}</span>
        <span className="text-sm text-muted-foreground mr-4">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : '--'}
        </span>
        <span className="text-sm text-muted-foreground mr-4">--</span>
        <ItemMenu />
    </div>
)

const ItemMenu = () => (
  <div className="absolute top-1 right-1">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Renommer</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copier</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Couper</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Clipboard className="mr-2 h-4 w-4" />
          <span>Coller</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Supprimer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
