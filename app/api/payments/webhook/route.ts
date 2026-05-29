import crypto from "crypto";

import { headers } from "next/headers";

import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();

  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  const headerList = await headers();

  const signature = headerList.get("x-paystack-signature");

  // Verify webhook signature
  if (hash !== signature) {
    return Response.json(
      {
        message: "Invalid signature",
      },
      {
        status: 401,
      },
    );
  }

  const event = JSON.parse(body);

  // Only process successful charge
  if (event.event === "charge.success") {
    const reference = event.data.reference;

    // Find payment
    const payment = await prisma.payment.findUnique({
      where: {
        Provider_Reference: reference,
      },

      include: {
        order: true,
      },
    });

    if (!payment) {
      return Response.json({
        received: true,
      });
    }

    // Prevent duplicate webhook processing
    if (payment.status === "SUCCESS") {
      return Response.json({
        received: true,
      });
    }

    // Update payment + order
    await prisma.$transaction([
      prisma.payment.update({
        where: {
          id: payment.id,
        },

        data: {
          status: "SUCCESS",

          paidAt: new Date(),
        },
      }),

      prisma.orders.update({
        where: {
          id: payment.orderId,
        },

        data: {
          paymentStatus: "PAID",

          status: "PAID",
        },
      }),

      prisma.orderStatusHistory.create({
        data: {
          orderId: payment.orderId,

          oldStatus: payment.order.status,

          newStatus: "PAID",

          changedById: payment.order.userId,
        },
      }),
    ]);
  }

  return Response.json({
    received: true,
  });
}
