"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

export async function getOrder(orderNumber: string) {
  const user = await requireAuth();

  const order = await prisma.orders.findFirst({
    where: {
      order_number: orderNumber,
      userId: user.id,
    },

    include: {
      items: {
        include: {
          dress: true,
        },
      },

      payment: true,

      delivery_address: true,

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
