"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

import { generateOrderNumber } from "@/lib/orders/generate-order-number";

type CreateSemiCustomOrderData = {
  selectedDressId: string;

  deliveryMethod: "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";

  deliveryAddressId?: string;

  measurementProfileId?: string;

  materialChoice?: string;

  customMaterialNotes?: string;

  customizationNotes?: string;

  customerBudget?: number;
};

export async function createSemiCustomOrder(data: CreateSemiCustomOrderData) {
  const user = await requireAuth();

  // Validate dress
  const dress = await prisma.dresses.findUnique({
    where: {
      id: data.selectedDressId,
    },
  });

  if (!dress) {
    throw new Error("Dress not found");
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

  // Validate measurement ownership
  if (data.measurementProfileId) {
    const measurement = await prisma.user_Measurements.findFirst({
      where: {
        id: data.measurementProfileId,
        userId: user.id,
      },
    });

    if (!measurement) {
      throw new Error("Invalid measurement");
    }
  }

  const order = await prisma.orders.create({
    data: {
      userId: user.id,

      order_number: await generateOrderNumber(),

      order_type: "SEMI_CUSTOM",

      status: "PENDING_REVIEW",

      payment_status: "UNPAID",

      total: 0,

      delivery_method: data.deliveryMethod,

      delivery_address_id: data.deliveryAddressId || "",

      custom_order: {
        create: {
          selected_dress_id: data.selectedDressId,

          measurement_profile_id: data.measurementProfileId,

          customization_notes: data.customizationNotes,

          customer_budget: data.customerBudget,
        },
      },

      statusHistory: {
        create: {
          oldStatus: null,

          newStatus: "PENDING_REVIEW",

          changedById: user.id,
        },
      },
    },

    include: {
      custom_order: true,
    },
  });

  return order;
}
