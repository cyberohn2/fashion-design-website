"use server";

import prisma from "@/lib/prisma";
import { render } from "@react-email/render";
import { createElement } from "react";
import { sendEmail } from "@/lib/send-mail";
import { requireAdmin } from "@/lib/auth/require-admin";
import OrderCompletedEmail from "@/lib/email-templates/order-completed";
import OrderRejectedEmail from "@/lib/email-templates/order-rejected";
import OrderRefundEmail from "@/lib/email-templates/order-refund";

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
      include: {
        user: true
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

    if (data.status === "COMPLETED") {
      const html = await render(
        createElement(OrderCompletedEmail, {
          customerName: order.user.full_name,
          orderNumber: order.order_number,
          delivery: order.delivery_method === "LOCAL_DELIVERY"
        }),
      );

      await sendEmail({
        to: order.user.email,
        subject: "Order Accepted!",
        html,
      });
    }

    if (data.status === "REJECTED") {
      let html;
      if (order.payment_status === "PAID") {
        html = await render(
          createElement(OrderRefundEmail, {
            customerName: order.user.full_name,
            orderNumber: order.order_number,
          }),
        );
      }else{
      html = await render(
        createElement(OrderRejectedEmail, {
          customerName: order.user.full_name,
          orderNumber: order.order_number,
        }),
      );}

      await sendEmail({
        to: order.user.email,
        subject: "Order Rejected!",
        html,
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(Error);
    throw new Error(message);
  }
}
