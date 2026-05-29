"use server";

import prisma from "@/lib/prisma";

export async function getDress(slug: string) {
  return prisma.dresses.findUnique({
    where: {
      slug,
    },

    include: {
      images: true,
      reviews: true,
    },
  });
}
