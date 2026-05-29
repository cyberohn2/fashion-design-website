"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

import { generateOrderNumber } from "@/lib/orders/generate-order-number";

type CreateReadyMadeOrderData = {
  dressId: string;

  quantity: number;

  notes?: string;

  deliveryMethod: "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";

  deliveryAddressId?: string;
};

export async function createReadyMadeOrder(data: CreateReadyMadeOrderData) {
  const user = await requireAuth();

  // Get dress
  const dress = await prisma.dresses.findUnique({
    where: {
      id: data.dressId,
    },
  });

  if (!dress) {
    throw new Error("Dress not found");
  }

  // Validate stock
  if (dress.stock < data.quantity) {
    throw new Error("Insufficient stock");
  }

  // Validate address if delivery selected
  if (data.deliveryMethod !== "PICKUP" && !data.deliveryAddressId) {
    throw new Error("Delivery address is required");
  }

  // Validate address ownership
  if (data.deliveryAddressId) {
    const address = await prisma.user_Addresses.findFirst({
      where: {
        id: data.deliveryAddressId,
        userId: user.id,
      },
    });

    if (!address) {
      throw new Error("Invalid address");
    }
  }

  // Calculate totals
  const total = Number(dress.base_price) * data.quantity;


  // Create order
  const order = await prisma.orders.create({
    data: {
      userId: user.id,

      order_number: await generateOrderNumber(),

      order_type: "READY_MADE",

      status: "AWAITING_PAYMENT",

      payment_status: "UNPAID",

      total,

      delivery_method: data.deliveryMethod,

      delivery_address_id: data.deliveryAddressId || "",
      notes: data.notes,

      items: {
        create: {
          dressId: dress.id,

          quantity: data.quantity,

          price: dress.base_price,
        },
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
}
