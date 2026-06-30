"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";

export async function confirmCustomOrderPayment(orderId: string) {
  const admin = await requireAdmin();

  const order = await prisma.orders.findUnique({
    where: {
      id: orderId,
    },
    include: {
      payment: true
    }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  await prisma.$transaction([
    prisma.orders.update({
      where: {
        id: order.id,
      },

      data: {
        payment_status: "PAID",
        status: "PAID",
        payment: {
          update: {
            where:{
              id: order.payment[0].id
            },
            data: {
              status: "PAID"
            }
          }
        }

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
