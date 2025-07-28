// src/services/partner.service.ts
import prisma from '../lib/prisma';
import type { Prisma, Partner } from '@prisma/client';

/**
 * Retrieves all partners from the database, ordered by the 'order' field.
 * @returns {Promise<Partner[]>} A list of all partners.
 */
export const getAllPartners = async (): Promise<Partner[]> => {
    return await prisma.partner.findMany({
        orderBy: { order: 'asc' },
    });
};

/**
 * Creates a new partner in the database.
 * @param {Prisma.PartnerCreateInput} data - The data for the new partner.
 * @returns {Promise<Partner>} The newly created partner.
 */
export const createPartner = async (data: Prisma.PartnerCreateInput): Promise<Partner> => {
    return await prisma.partner.create({ data });
};

/**
 * Updates an existing partner.
 * @param {string} id - The ID of the partner to update.
 * @param {Prisma.PartnerUpdateInput} data - The new data for the partner.
 * @returns {Promise<Partner>} The updated partner.
 */
export const updatePartner = async (id: string, data: Prisma.PartnerUpdateInput): Promise<Partner> => {
    return await prisma.partner.update({
        where: { id },
        data,
    });
};

/**
 * Deletes a partner from the database.
 * @param {string} id - The ID of the partner to delete.
 * @returns {Promise<Partner>} The deleted partner.
 */
export const deletePartner = async (id: string): Promise<Partner> => {
    return await prisma.partner.delete({
        where: { id },
    });
};
