import { requireAdmin } from "@/lib/auth/require-admin";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { formatDate } from "@/lib/format-table";
import prisma from "@/lib/prisma";

export async function getPayments({
  pagination,
  searchTerm,
}: {
  pagination: { page: number };
  searchTerm?: string;
}) {
  await requireAdmin();

  try {
    const payment = await prisma.$transaction(async (tx: TransactionClient) => {
      const fetchedPayment = await tx.payment.findMany({
        where: searchTerm
          ? {
              Provider_Reference: { contains: searchTerm, mode: "insensitive" },
            }
          : {},
        include: {
          order: true,
        },
        take: 20,
        skip: (pagination.page - 1) * 20,
        orderBy: {
          paidAt: "asc",
        },
      });
      const totalPayment = await tx.payment.count({
        where: searchTerm
          ? {
              Provider_Reference: { contains: searchTerm, mode: "insensitive" },
            }
          : {},
      });

      const formattedPayment = fetchedPayment.map((pmt) => ({
        ...pmt,
        status: pmt.status,
        amount: pmt.amount,
      }));

      return { formattedPayment, totalPayment, page: pagination.page };
    });

    return { payment };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}