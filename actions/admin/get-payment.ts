import { requireAdmin } from "@/lib/auth/require-admin";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { formatDate } from "@/lib/format-table";
import prisma from "@/lib/prisma";

export async function getPayments({ pagination }: { pagination: { page: number } }) {
  await requireAdmin();

  try {
    const payment = await prisma.$transaction( async (tx: TransactionClient) =>{
        const fetchedPayment = await tx.payment.findMany({
            where: {
                status: "PAID",
            },
            include: {
                order: true
            },
            take: 20,
            skip: (pagination.page - 1) * 20,
            orderBy: {
                paidAt: "desc",
            },
        });
        const totalPayment = await tx.payment.count()

        const formattedPayment = fetchedPayment.map((pmt) => ({
            ...pmt,
            date: formatDate(pmt.paidAt),
          status: pmt.status,
          amount: pmt.amount,
        }));

        return {formattedPayment, totalPayment}
    })
    
    return { payment };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}