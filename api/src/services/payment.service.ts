// src/services/payment.service.ts
import prisma from '../lib/prisma';
import type { PaymentService } from '@prisma/client';

export const getAllPaymentServices = async (): Promise<PaymentService[]> => {
  return await prisma.paymentService.findMany({
    orderBy: { createdAt: 'asc' },
  });
};

export const getActivePaymentServices = async (): Promise<PaymentService[]> => {
    return await prisma.paymentService.findMany({
        where: { isActive: true },
        orderBy: { isDefault: 'desc' }
    });
};

export const updatePaymentService = async (id: string, data: { isActive?: boolean; apiKeys?: any }): Promise<PaymentService> => {
  return await prisma.paymentService.update({
    where: { id },
    data,
  });
};

export const setDefaultService = async (id: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    // Unset the old default
    await tx.paymentService.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    });

    // Set the new default and ensure it's active
    await tx.paymentService.update({
      where: { id },
      data: { isDefault: true, isActive: true },
    });
  });
};

export const isDefaultService = async (id: string): Promise<boolean> => {
    const service = await prisma.paymentService.findUnique({
        where: { id },
        select: { isDefault: true }
    });
    return service?.isDefault ?? false;
}
