import { File, Folder, Image as ImageIcon, Video, FileText, Music, FileArchive, FileSpreadsheet, FileType2 } from "lucide-react";
import type { ArchiveItemType } from "@/types/archive";

interface FileIconProps {
    type: ArchiveItemType;
    className?: string;
}

export const FileIcon = ({ type, className }: FileIconProps) => {
    switch (type) {
        case "FOLDER":
            return <Folder className={className} />;
        case "DOCUMENT":
            return <FileType2 className={className} />;
        case "SPREADSHEET":
            return <FileSpreadsheet className={className} />;
        case "IMAGE":
            return <ImageIcon className={className} />;
        case "VIDEO":
            return <Video className={className} />;
        case "AUDIO":
            return <Music className={className} />;
        case "PDF":
            return <File className={className} />;
        case "ARCHIVE":
            return <FileArchive className={className} />;
        case "TEXT":
            return <FileText className={className} />;
        default:
            return <File className={className} />;
    }
}
