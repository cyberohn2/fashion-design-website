"use server"

import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { PaymentStatus } from "@/components/admin-components/order/order-details";
import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";

export async function updatePaymentStatus({ref, status}:{ref: string, status: PaymentStatus}) {
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
                },
            });
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