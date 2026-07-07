"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";

export async function searchCustomers({ pagination, searchTerm }: { pagination: { page: number }; searchTerm?: string }) {
  requireAdmin();

  try {
    const customers = await prisma.$transaction( async (tx: TransactionClient) => {
      const fetchedCustomers = await tx.user.findMany({
        where: {
            role: "USER",
            OR: [
                {
                    full_name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        },
        take: 20,
        skip: (pagination.page - 1) * 20,
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalCustomer = await tx.user.count({
        where: {
          role: "USER",
          OR: [
            {
              full_name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return {fetchedCustomers, totalCustomer, page: pagination.page}
    })

    return customers;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
