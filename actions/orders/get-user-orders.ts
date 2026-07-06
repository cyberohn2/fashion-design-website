"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

export async function getUserOrders({ pagination }: { pagination: { page: number } }) {
  const user = await requireAuth();

  try {
    const orders = await prisma.$transaction(async (tx) => {
      const orders = await tx.orders.findMany({
        where: {
          userId: user.id,
        },

        include: {
          items: {
            include: {
              dress: true,
            },
          },
          payment: true,
          statusHistory: true,
        },
        take: 20,
        skip: (pagination.page - 1) * 20,
        orderBy: {
          createdAt: "desc",
        },
      });
      const totalOrders = await tx.orders.count({
        where: {
          userId: user.id,
        },
      });
      return { orders, totalOrders, page: pagination.page };
    })

    return orders;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
