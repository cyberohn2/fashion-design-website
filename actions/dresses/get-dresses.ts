"use server";

import prisma from "@/lib/prisma";

export async function getDresses({query}: {
  query?: {
    searchTerm?: string;
    category?:
      | "FEMALE_NATIVE"
      | "MALE_NATIVE"
      | "CORPORATE_MALE"
      | "CORPORATE_FEMALE"
      | "CASUAL"
      | "STREET_WEAR";
  };
}) {
  try {
    return await prisma.dresses.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query?.searchTerm || "",
              mode: "insensitive",
            },
            category: query?.category,
          },
        ],
        isPublished: true,
      },

      include: {
        images: true,
        reviews: true,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
