"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export async function getAddresses() {
  const user = await requireAuth();

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
}
