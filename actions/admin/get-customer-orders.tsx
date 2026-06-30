"use server";

import prisma from "@/lib/prisma";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function getCustomerOrders({pagination, userId}: {pagination:{page: number }, userId: string}) {
  await requireAdmin();

  try {
    const orders = await prisma.$transaction( async (tx: TransactionClient) =>{
        const AllOrders = await tx.orders.findMany({
            where: {
                userId
            },
            include: {
                payment: true,
                statusHistory: true,
                user: true
            },

            take: 20,
            skip: (pagination.page - 1) * 20,
            orderBy: {
                createdAt: "desc",
            },
        });
        const totalOrders = await tx.orders.count({
            where: {
                userId
            }
        })

        return {AllOrders: AllOrders || [], totalOrders, username: AllOrders[0]?.user?.full_name}
    })

    return orders;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
