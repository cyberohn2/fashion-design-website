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
      custom_order: true
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Prevent duplicate payments
  if (order.payment?.status === "PAID") {
    throw new Error("Order already paid");
  }

  const amount =
    Number(order.total) > 0
      ? Number(order.total) * 100
      : Number(order.custom_order?.admin_final_price) > 0
        ? Number(order.custom_order?.admin_final_price) * 100
        : Number(order.custom_order?.customer_budget) * 100 

  // Initialize Paystack payment
  const response = await paystack.post("/transaction/initialize", {
    email: user.email,
    
    amount,

    currency: "NGN",

    metadata: {
      orderId: order.id,
      orderNumber: order.order_number,
    },

    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-status`,
  });

  const paymentData = response.data.data;

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      userId: user.id,
      Provider: "PAYSTACK",

      Provider_Reference: paymentData.reference,

      amount: order.total,

      status: "PENDING",

      paidAt: new Date(),
    },
  });

  return {
    authorization_url: paymentData.authorization_url,
    access_code: paymentData.access_code,
  };
}
