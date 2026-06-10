"use server";

import prisma from "@/lib/prisma";

export async function getDress(slug: string) {
  try {
    return await prisma.dresses.findUnique({
      where: {
        slug,
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
