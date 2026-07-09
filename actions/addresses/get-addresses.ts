"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export async function getAddresses() {
  const user = await requireAuth();

  try {
    return await prisma.user_Addresses.findMany({
      where: {
        userId: user.id,
      },

      orderBy: [
        {
          is_default: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
  
}
