// src/services/appointment.service.ts
import prisma from '../lib/prisma';
import { AppointmentStatus, type Prisma } from '@prisma/client';

export const createAppointment = async (data: Prisma.AppointmentCreateInput) => {
    return await prisma.appointment.create({ data });
};

export const getAllAppointments = async () => {
    return await prisma.appointment.findMany({
        orderBy: {
            scheduledAt: 'asc'
        }
    });
};

export const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    return await prisma.appointment.update({
        where: { id },
        data: { status }
    });
};
