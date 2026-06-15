"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

export async function getUserOrders() {
  const user = await requireAuth();

  try {
    const orders = await prisma.orders.findMany({
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
      },

      orderBy: {
        createdAt: "desc",
      },
    });
    return orders;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
