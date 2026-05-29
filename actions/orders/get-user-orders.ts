"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

export async function getUserOrders() {
  const user = await requireAuth();

  return prisma.orders.findMany({
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
}
