// src/services/action.service.ts
import prisma from '../lib/prisma';
import type { Prisma, Action } from '@prisma/client';

/**
 * Retrieves all actions from the database, ordered by the 'order' field.
 * @returns {Promise<Action[]>} A list of all action items.
 */
export const getAllActions = async (): Promise<Action[]> => {
    return await prisma.action.findMany({
        orderBy: { order: 'asc' },
    });
};

/**
 * Creates a new action item in the database.
 * @param {Prisma.ActionCreateInput} data - The data for the new action.
 * @returns {Promise<Action>} The newly created action item.
 */
export const createAction = async (data: Prisma.ActionCreateInput): Promise<Action> => {
    return await prisma.action.create({ data });
};

/**
 * Updates an existing action item.
 * @param {string} id - The ID of the action to update.
 * @param {Prisma.ActionUpdateInput} data - The new data for the action.
 * @returns {Promise<Action>} The updated action item.
 */
export const updateAction = async (id: string, data: Prisma.ActionUpdateInput): Promise<Action> => {
    return await prisma.action.update({
        where: { id },
        data,
    });
};

/**
 * Deletes an action item from the database.
 * @param {string} id - The ID of the action to delete.
 * @returns {Promise<Action>} The deleted action item.
 */
export const deleteAction = async (id: string): Promise<Action> => {
    return await prisma.action.delete({
        where: { id },
    });
};
