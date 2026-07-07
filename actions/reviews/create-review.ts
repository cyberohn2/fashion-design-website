import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";

export async function createReview(data: { dressId: string; rating: number; comment: string; type: "CUSTOMISED" | "ORIGINAL" }) {
    const user = await requireAuth();

    try {
        const newReview = await prisma.reviews.create({
            data: {
                userId: user.id,
                dressId: data.dressId,
                rating: data.rating,
                comment: data.comment,
                type: data.type
            }
        })
        return newReview;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(message);
    }
    
}