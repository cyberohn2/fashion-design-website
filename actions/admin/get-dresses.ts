import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";

export async function getDresses({ pagination }: { pagination: { page: number } }) {
    await requireAdmin()

    try {
        const dresses = await prisma.$transaction(
          async (tx: TransactionClient) => {
            const dresses = await tx.dresses.findMany({
              include: {
                images: true
              },
              take: 20,
              skip: (pagination.page - 1) * 20,
              orderBy: {
                soldCount: "desc",
              },
            });

            const totalDress = await tx.dresses.count()
            return {dresses, totalDress, page: pagination.page}
          },    
        );

        return dresses;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error(message)
    }
}