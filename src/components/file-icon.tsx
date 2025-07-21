import { File, Folder, Image as ImageIcon, Video, FileText, Music, FileArchive, FileSpreadsheet, FileType2 } from "lucide-react";
import type { ArchiveItemType } from "@/types/archive";

interface FileIconProps {
    type: ArchiveItemType;
    className?: string;
}

export const FileIcon = ({ type, className }: FileIconProps) => {
    switch (type) {
        case "folder":
            return <Folder className={className} />;
        case "document":
            return <FileType2 className={className} />;
        case "spreadsheet":
            return <FileSpreadsheet className={className} />;
        case "image":
            return <ImageIcon className={className} />;
        case "video":
            return <Video className={className} />;
        case "audio":
            return <Music className={className} />;
        case "pdf":
            return <File className={className} />;
        case "archive":
            return <FileArchive className={className} />;
        case "text":
            return <FileText className={className} />;
        default:
            return <File className={className} />;
    }
}
