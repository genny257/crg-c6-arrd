// src/services/archive.service.ts
import prisma from '../lib/prisma';
import type { Prisma } from '@prisma/client';

/**
 * Retrieves items from the database based on their parent folder ID.
 * @param {string | null} parentId - The ID of the parent folder. Null for the root directory.
 * @returns {Promise<any[]>} A list of archive items.
 */
export const getArchiveItems = async (parentId: string | null) => {
    return await prisma.archiveItem.findMany({
        where: { parentId },
        orderBy: [{ type: 'asc' }, { name: 'asc' }], // Folders first, then by name
    });
};

/**
 * Creates a new folder (ArchiveItem) in the database.
 * @param {string} name - The name of the new folder.
 * @param {string | null} parentId - The ID of the parent folder.
 * @param {string} authorId - The ID of the user creating the folder.
 * @returns {Promise<any>} The newly created folder item.
 */
export const createFolder = async (name: string, parentId: string | null, authorId: string) => {
    
    // Check for existing folder with the same name in the same directory
    const existing = await prisma.archiveItem.findFirst({
        where: {
            name,
            parentId,
            type: 'FOLDER',
        }
    });

    if (existing) {
        throw new Error("Un dossier avec ce nom existe déjà à cet emplacement.");
    }

    const data: Prisma.ArchiveItemCreateInput = {
        name,
        type: 'FOLDER',
        author: { connect: { id: authorId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
    };

    return await prisma.archiveItem.create({ data });
};
