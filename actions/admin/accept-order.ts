"use server";

import prisma from "@/lib/prisma";
import { render } from "@react-email/render";
import { createElement } from "react";
import { sendEmail } from "@/lib/send-mail";
import { requireAdmin } from "@/lib/auth/require-admin";
import OrderAcceptedEmail from "@/lib/email-templates/order-accepted";
import { initializePayment } from "../payments/initialize-payment";

type UpdateOrderStatusData = {
  orderId: string;
  status: "ACCEPTED";
  adminAmount: number;
};

export async function acceptOrder(data: UpdateOrderStatusData) {
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
          custom_order: {
            update: {
                admin_final_price: data.adminAmount
                // create a route for this server fn that will also send email to the customer
            }
          }
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

    if (data.adminAmount > 0) {
      try {
        const payment = await initializePayment(order.id);
        const html = await render(
          createElement(OrderAcceptedEmail, {
            customerName: order.user.full_name,
            orderNumber: order.order_number,
            paymentUrl: payment && payment.authorization_url,
            price: payment && data.adminAmount,
          }),
        );

        await sendEmail({
          to: order.user.email,
          subject: "Order Accepted!",
          html,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(message);
      }
    }
    return {
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
  }
}
