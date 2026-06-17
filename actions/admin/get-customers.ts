"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";

export async function getCustomers({ pagination }: { pagination: { page: number } }) {
  requireAdmin();

  try {
    const customers = await prisma.$transaction( async (tx: TransactionClient) => {
      const fetchedCustomers = await tx.user.findMany({
        where: {
          role: "USER",
        },
        take: 20,
        skip: (pagination.page - 1) * 20,
        orderBy: {
          createdAt: "asc",
        },
      });

      const totalCustomer = await tx.user.count();

      return {fetchedCustomers, totalCustomer}
    })

    return customers;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
