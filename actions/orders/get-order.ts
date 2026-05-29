"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

export async function getOrder(orderId: string) {
  const user = await requireAuth();

  const order = await prisma.orders.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },

    include: {
      items: {
        include: {
          dress: true,
        },
      },

      payment: true,

      deliveryAddress: true,

      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}
