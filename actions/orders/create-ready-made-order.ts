"use server";

import prisma from "@/lib/prisma";
import { render } from "@react-email/render";
import { createElement } from "react";

import { requireAuth } from "@/lib/auth/require-auth";
import { sendEmail } from "@/lib/send-mail";
import { generateOrderNumber } from "@/lib/orders/generate-order-number";
import ReadyMadeEmail from "@/lib/email-templates/ready-made";

type CreateReadyMadeOrderData = {
  dresses: {
    dressId: string;
    quantity: number;
  }[];
  notes?: string;

  deliveryMethod: "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";
  deliveryAddressId?: string;
};

export async function createReadyMadeOrder(data: CreateReadyMadeOrderData) {
  const user = await requireAuth();

  if (data.dresses.length === 0) {
    throw new Error("No dresses selected");
  }

  // Merge duplicate dresses
  const mergedDressMap = new Map<string, number>();

  for (const item of data.dresses) {
    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    mergedDressMap.set(
      item.dressId,
      (mergedDressMap.get(item.dressId) ?? 0) + item.quantity,
    );
  }

  const orderItems = [...mergedDressMap.entries()].map(
    ([dressId, quantity]) => ({
      dressId,
      quantity,
    }),
  );

  // Validate address if delivery selected
  if (data.deliveryMethod !== "PICKUP" && !data.deliveryAddressId) {
    throw new Error("Delivery address is required");
  }

  const order = await prisma.$transaction(async (tx) => {
    // Validate address ownership
    if (data.deliveryAddressId) {
      const address = await tx.user_Addresses.findFirst({
        where: {
          id: data.deliveryAddressId,
          userId: user.id,
        },
      });

      if (!address) {
        throw new Error("Invalid address");
      }
    }

    const dressIds = orderItems.map((item) => item.dressId);

    const dresses = await tx.dresses.findMany({
      where: {
        id: {
          in: dressIds,
        },
      },
    });

    if (dresses.length !== dressIds.length) {
      throw new Error("One or more dresses were not found");
    }

    const dressMap = new Map(dresses.map((dress) => [dress.id, dress]));

    // Validate stock
    for (const item of orderItems) {
      const dress = dressMap.get(item.dressId);

      if (!dress) {
        throw new Error("Dress not found");
      }

      if (dress.stock < item.quantity) {
        throw new Error(`${dress.title} has insufficient stock`);
      }
    }

    // Calculate total
    const total = orderItems.reduce((sum, item) => {
      const dress = dressMap.get(item.dressId)!;

      return sum + Number(dress.base_price) * item.quantity;
    }, 0);

    const order = await tx.orders.create({
      data: {
        userId: user.id,

        order_number: await generateOrderNumber(),

        order_type: "READY_MADE",

        status: "AWAITING_PAYMENT",

        payment_status: "UNPAID",

        total,

        delivery_method: data.deliveryMethod,

        delivery_address_id: data.deliveryAddressId ?? "",

        notes: data.notes,

        items: {
          create: orderItems.map((item) => {
            const dress = dressMap.get(item.dressId)!;

            return {
              dressId: dress.id,
              quantity: item.quantity,
              price: dress.base_price,
            };
          }),
        },

        statusHistory: {
          create: {
            oldStatus: null,
            newStatus: "AWAITING_PAYMENT",
            changedById: user.id,
          },
        },
      },

      include: {
        items: true,
      },
    });

    return order;
  });

  const html = await render(
    createElement(ReadyMadeEmail, {
      customerName: user.full_name,
      orderNumber: order.order_number,
    }),
  );

  await sendEmail({
    to: user.email,
    subject: "We've received your order",
    html,
  });

  return order;
}
