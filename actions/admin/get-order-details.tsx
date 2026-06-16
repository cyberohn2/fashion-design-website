import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";

export async function getOrderDetails(order_number: string) {
    await requireAdmin()

    try {
        const orderDetails = prisma.orders.findUnique({
            where: {
                order_number
            },
            include: {
                user: true,
                delivery_address: true,
                payment: true,
                items: {
                    include: {
                        dress: true
                    }
                },
                custom_order: {
                    include: {
                        dress: true
                    }
                },
                statusHistory: true,
            }
        })
        return orderDetails;

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(message);
    }
}