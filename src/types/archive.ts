export type ArchiveItemType = "FOLDER" | "DOCUMENT" | "SPREADSHEET" | "IMAGE" | "VIDEO" | "AUDIO" | "PDF" | "ARCHIVE" | "TEXT" | "UNKNOWN";

export interface ArchiveItem {
    id: string;
    name: string;
    type: ArchiveItemType;
    parentId: string | null;
    createdAt: string;
    url?: string | null;
    // We can add more fields later, like size, etc.
}
