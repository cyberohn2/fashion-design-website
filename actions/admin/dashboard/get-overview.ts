"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";


export async function getOverview() {
    await requireAdmin()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
        const dashboardOverview = await prisma.$transaction(async (tx: TransactionClient) => {
            // 1. Total revenue
            const payments = await tx.payment.findMany({
              where: {
                status: "PAID",
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            });
            let totalRevenue = 0;
            payments.forEach( pay => totalRevenue+= Number(pay.amount))
            
            // 2. total orders
            const totalOrder = await tx.orders.count({
              where: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            });

            // 3. pending reviews
            const pendingReviews = await tx.orders.count({
                where: {
                    status: "PENDING_REVIEW"
                }
            })

            // 4. Customers
            const customers = await tx.user.count({
              where: {
                role: "USER",
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            });

            return({totalRevenue, totalOrder, pendingReviews, customers})
        }) 

        return dashboardOverview;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(message);
    }
}