"use server"

import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { PaymentStatus } from "@/components/admin-components/order/order-details";
import { requireAuth } from "@/lib/auth/require-auth";
import PaymentReceivedEmail from "@/lib/email-templates/payment-received";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/send-mail";
import { render } from "@react-email/render";
import { createElement } from "react";

export async function updatePaymentStatus({ref, status, paidAt}:{ref: string, status: PaymentStatus, paidAt?: string}) {
  const user = await requireAuth();

  try {
    const data = await prisma.$transaction( async (tx: TransactionClient) => {
        const payment = await tx.payment.update({
            where: {
                Provider_Reference: ref,
                userId: user.id,
            },
            data: {
                status,
                paidAt: new Date(paidAt as string)
            },
            include: {
                order: true
            }
        });

        if (status === "PAID") {
          const order = await tx.orders.update({
            where: {
              id: payment.order.id,
            },
            data: {
              status,
              payment_status: "PAID",
              statusHistory: {
                create: {
                  oldStatus: payment.order.status,
                  newStatus: "PAID",
                  changedById: user.id,
                },
              },
            },
            include: {
              user: true,
              items: {
                include: {
                  dress: true,
                },
              },
            },
          });

          // Send email to customer
          const html = await render(
            createElement(PaymentReceivedEmail, {
              customerName: order.user.full_name,
              orderNumber: order.order_number,
            }),
          );

          await sendEmail({
            to: order.user.email,
            subject: "Payment Received!",
            html,
          });

          // Update stock for every dress in the order
          if (order.order_type === "READY_MADE") {
            await Promise.all(
              order.items.map((item) =>
                tx.dresses.update({
                  where: {
                    id: item.dress.id,
                  },
                  data: {
                    stock: {
                      decrement: item.quantity,
                    },
                    soldCount: {
                      increment: item.quantity
                    }
                  },
                }),
              ),
            );
          }
          
          return { payment, order };
        }

        return {payment};
    })

    return data
    
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}