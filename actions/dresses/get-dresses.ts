"use server";

import prisma from "@/lib/prisma";

export async function getDresses() {
  return prisma.dresses.findMany({
    where: {
      isPublished: true,
    },

    include: {
      images: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
