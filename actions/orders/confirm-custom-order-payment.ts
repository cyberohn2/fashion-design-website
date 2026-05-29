"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";

export async function confirmCustomOrderPayment(orderId: string) {
  const admin = await requireAdmin();

  const order = await prisma.orders.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.order_type === "READY_MADE") {
    throw new Error("Ready-made payments are automatic");
  }

  await prisma.$transaction([
    prisma.orders.update({
      where: {
        id: order.id,
      },

      data: {
        paymentStatus: "PAID",

        status: "PAID",
      },
    }),

    prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,

        oldStatus: order.status,

        newStatus: "PAID",

        changedById: admin.id,
      },
    }),
  ]);

  return {
    success: true,
  };
}
