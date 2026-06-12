"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";


export async function getOverview() {
    const admin = await requireAdmin()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
        const dashboardOverview = await prisma.$transaction(async (tx: TransactionClient) => {
            // 1. Total revenue
            const totalRevenue = await tx.payment.count({
              where: {
                status: "PAID",
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            });
            
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