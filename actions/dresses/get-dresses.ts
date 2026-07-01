"use server";

import prisma from "@/lib/prisma";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";

export async function getDresses({
  query,
  pagination,
}: {
  query?: {
    searchTerm?: string;
    category?:
      | "FEMALE_NATIVE"
      | "MALE_NATIVE"
      | "CORPORATE_MALE"
      | "CORPORATE_FEMALE"
      | "CASUAL"
      | "STREET_WEAR";
    type?: "BESPOKE" | "KAFTAN" | "MONOGRAM" | "NATIVE" | "READYMADE";
  };
  pagination: { page: number };
}) {
  try {
    const dresses = await prisma.$transaction(async (tx: TransactionClient) => {
      const AllDresses = await tx.dresses.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query?.searchTerm,
                mode: "insensitive",
              },
            },
            {
              category: query?.category,
            },
            {
              type: query?.type,
            },
          ],
          isPublished: true,
        },

        take: 20,
        skip: (pagination.page - 1) * 20,
        include: {
          images: true,
          reviews: true,
        },
      });

      const totalDresses = await tx.dresses.count({
        where: {
          OR: [
            {
              title: {
                contains: query?.searchTerm,
                mode: "insensitive",
              },
              category: query?.category,
            },
          ],
          isPublished: true,
        },
      });

      return { AllDresses, totalDresses };
    });
    return dresses;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
