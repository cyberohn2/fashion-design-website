"use server";

import prisma from "@/lib/prisma";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function searchPayments({pagination, searchTerm}: {pagination:{page: number }, searchTerm: string}) {
  await requireAdmin();

  try {
    const payments = await prisma.$transaction( async (tx: TransactionClient) =>{
        const AllPayments = await tx.payment.findMany({
          where: searchTerm
            ? { Provider_Reference: { contains: searchTerm, mode: "insensitive" } }
            : {},

          take: 20,
          skip: (pagination.page - 1) * 20,
          orderBy: {
            createdAt: "desc",
          },
        });
        const totalPayments = await tx.payment.count({
          where: {
            Provider_Reference: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        });

        return {AllPayments, totalPayments, page: pagination.page}
    })

    return payments;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
