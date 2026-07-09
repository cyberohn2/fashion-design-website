"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export async function getAddress(addressId: string) {
  const user = await requireAuth();

  try {
    const address = await prisma.user_Addresses.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    return address;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
