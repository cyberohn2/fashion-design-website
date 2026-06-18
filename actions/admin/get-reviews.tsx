import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";

export async function getReviews({ pagination }: { pagination: { page: number } }) {
    await requireAdmin()

    try {
        const reviews = await prisma.$transaction(
          async (tx: TransactionClient) => {
            const reviews = await tx.reviews.findMany({
              include: {
                user: true,
                dress: true,
              },
              take: 20,
              skip: (pagination.page - 1) * 20,
              orderBy: {
                createdAt: "asc",
              },
            });

            const totalReview = await tx.reviews.count()
            return {reviews, totalReview}
          },    
        );

        return reviews;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.error(message)
    }
}