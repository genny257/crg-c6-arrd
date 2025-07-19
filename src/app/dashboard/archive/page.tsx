
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
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

const initialItems: ArchiveItem[] = [
  { id: "1", name: "Rapports Annuels", type: "folder", parentId: null },
  { id: "2", name: "Projets 2024", type: "folder", parentId: null },
  { id: "3", name: "Communication", type: "folder", parentId: null },
  {
    id: "4",
    name: "budget_previsionnel_2024.xlsx",
    type: "spreadsheet",
    parentId: "2",
  },
  { id: "5", name: "rapport_activite_2023.docx", type: "document", parentId: "1" },
  { id: "6", name: "flyer_collecte_sang.png", type: "image", parentId: "3" },
  { id: "7", name: "notes_reunion_staff.txt", type: "text", parentId: "2" },
  { id: "8", name: "Archives 2022", type: "folder", parentId: null },
];

export default function ArchivePage() {
  const [items] = React.useState<ArchiveItem[]>(initialItems);
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const currentFolderId = null; // For now, we are at the root
  const breadcrumbs = ["Archives"]; // Static for now

  const visibleItems = items.filter((item) => item.parentId === currentFolderId);

  return (
    <div className="flex flex-col h-full gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Archives</h1>
          <p className="text-muted-foreground">
            {breadcrumbs.join(" / ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setView(view === "grid" ? "list" : "grid")}>
            {view === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FilePlus2 className="mr-2 h-4 w-4" />
                Nouveau
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FolderPlus className="mr-2 h-4 w-4" />
                <span>Nouveau dossier</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileIcon type="document" className="mr-2 h-4 w-4" />
                <span>Document Word</span>
              </DropdownMenuItem>
               <DropdownMenuItem>
                <FileIcon type="spreadsheet" className="mr-2 h-4 w-4" />
                <span>Fichier Excel</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Téléverser
          </Button>
        </div>
      </header>

      <div className="flex-1 rounded-lg border border-dashed p-4">
        {view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {visibleItems.map((item) => (
              <ItemGrid key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
             {visibleItems.map((item) => (
              <ItemList key={item.id} item={item} />
            ))}
          </div>
        )}
         {visibleItems.length === 0 && (
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

const ItemGrid = ({ item }: { item: ArchiveItem }) => (
  <div className="group relative flex flex-col items-center justify-center text-center p-2 rounded-lg hover:bg-accent cursor-pointer">
    <FileIcon type={item.type} className="w-16 h-16 mb-2" />
    <span className="text-sm font-medium truncate w-full">{item.name}</span>
    <ItemMenu />
  </div>
);

const ItemList = ({ item }: { item: ArchiveItem }) => (
    <div className="group relative flex items-center p-2 rounded-lg hover:bg-accent cursor-pointer">
        <FileIcon type={item.type} className="w-6 h-6 mr-4" />
        <span className="text-sm font-medium truncate flex-1">{item.name}</span>
        <span className="text-sm text-muted-foreground mr-4">--</span>
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
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Couper</span>
           <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Clipboard className="mr-2 h-4 w-4" />
          <span>Coller</span>
           <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
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
