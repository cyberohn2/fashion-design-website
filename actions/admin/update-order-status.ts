"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";

type UpdateOrderStatusData = {
  orderId: string;

  status:
    | "IN_PRODUCTION"
    | "READY_FOR_DELIVERY"
    | "DELIVERED"
    | "SHIPPED"
    | "COMPLETED"
    | "REJECTED"
    | "ACCEPTED"
    | "CANCELLED";
};

export async function updateOrderStatus(data: UpdateOrderStatusData) {
  const admin = await requireAdmin();
  try {
    const order = await prisma.orders.findUnique({
      where: {
        id: data.orderId,
      },
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
          status: data.status,
        },
      }),

      prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,

          oldStatus: order.status,

          newStatus: data.status,

          changedById: admin.id,
        },
      }),
    ]);

    return {
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
  }
}
