"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

import { paystack } from "@/lib/paystack";

export async function initializePayment(orderId: string) {
  const user = await requireAuth();

  // Find order
  const order = await prisma.orders.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },

    include: {
      payment: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Only ready-made orders can pay online
  if (order.order_type !== "READY_MADE") {
    throw new Error("Online payment unavailable for this order");
  }

  // Prevent duplicate payments
  if (order.payment_status === "PAID") {
    throw new Error("Order already paid");
  }

  // Initialize Paystack payment
  const response = await paystack.post("/transaction/initialize", {
    email: user.email,

    amount: Number(order.total) * 100,

    currency: "NGN",

    metadata: {
      orderId: order.id,
      orderNumber: order.order_number,
    },

    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
  });

  const paymentData = response.data.data;

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,

      Provider: "PAYSTACK",

      Provider_Reference: paymentData.reference,

      amount: order.total,

      status: "PENDING",

      paidAt: new Date(),
    },
  });

  return {
    authorizationUrl: paymentData.authorization_url,
  };
}
