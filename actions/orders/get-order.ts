"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

export async function getOrder(orderNumber: string) {
  const user = await requireAuth();

  try {
    const order = await prisma.orders.findFirst({
      where: {
        order_number: orderNumber,
        userId: user.id,
      },

      include: {
        custom_order: {
          include:{
            dress: true,
            measurements: true
          },
        },
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
      console.error("Order not found");
    }
    return order;

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }

}
