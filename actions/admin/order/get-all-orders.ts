"use server";

import prisma from "@/lib/prisma";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function getAllOrders({
  pagination,
  searchTerm,
}: {
  pagination: { page: number };
  searchTerm?: string;
}) {
  await requireAdmin();

  try {
    const orders = await prisma.$transaction(async (tx: TransactionClient) => {
      const AllOrders = await tx.orders.findMany({
        where: searchTerm
          ? { order_number: { contains: searchTerm, mode: "insensitive" } }
          : {},
        include: {
          payment: true,
          statusHistory: true,
        },

        take: 20,
        skip: (pagination.page - 1) * 20,
        orderBy: {
          createdAt: "desc",
        },
      });
      const totalOrders = await tx.orders.count({
        where: searchTerm
          ? { order_number: { contains: searchTerm, mode: "insensitive" } }
          : {},
        },
      );

      return { AllOrders, totalOrders, page: pagination.page };
    });

    return orders;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
