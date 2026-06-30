"use server";

import prisma from "@/lib/prisma";
import { render } from "@react-email/render";
import { requireAuth } from "@/lib/auth/require-auth";
import OrderCreatedEmail from "@/lib/email-templates/order-created"
import { generateOrderNumber } from "@/lib/orders/generate-order-number";
import { sendEmail } from "@/lib/send-mail";
import { createElement } from "react";

export type CreateFullCustomOrderData = {
  ideaImageUrl: string;

  deliveryMethod: "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";

  deliveryAddressId?: string;

  measurementProfileId?: string;

  customizationNotes?: string;

  customerBudget?: number;
};

export async function createFullCustomOrder(data: CreateFullCustomOrderData) {
  const user = await requireAuth();

 try {
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

       order_type: "FULL_CUSTOM",

       status: "PENDING_REVIEW",

       payment_status: "UNPAID",

       total: 0,

       delivery_method: data.deliveryMethod,

       delivery_address_id: data.deliveryAddressId || "",

       custom_order: {
         create: {
           idea_image_url: data.ideaImageUrl,

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

  const html = await render(
    createElement(OrderCreatedEmail, {
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
 } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(message)
 }
}
