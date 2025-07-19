
export type ArchiveItemType = "folder" | "document" | "spreadsheet" | "image" | "video" | "audio" | "pdf" | "archive" | "text" | "unknown";

export interface ArchiveItem {
    id: string;
    name: string;
    type: ArchiveItemType;
    parentId: string | null;
    // We can add more fields later, like size, createdAt, etc.
}
