"use server";

import prisma from "@/lib/prisma";
import { TransactionClient } from "@/app/generated/prisma/internal/prismaNamespace";
import { Prisma } from "@/app/generated/prisma/client";

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
    const orConditions: Prisma.DressesWhereInput[] = [];

    if (query?.searchTerm) {
      orConditions.push({
        title: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      });
    }

    if (query?.category) {
      orConditions.push({
        category: query.category,
      });
    }

    if (query?.type) {
      orConditions.push({
        type: query.type,
      });
    }

    const where = {
      isPublished: true,
      ...(orConditions.length > 0 && { OR: orConditions }),
    };


    const dresses = await prisma.$transaction(async (tx: TransactionClient) => {
      const AllDresses = await tx.dresses.findMany({
        where,
        take: 20,
        skip: (pagination.page - 1) * 20,
        include: {
          images: true,
          reviews: true,
        },
      });

      const totalDresses = await tx.dresses.count({
        where,
      });

      return { AllDresses, totalDresses, page: pagination.page };
    });
    return dresses;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
