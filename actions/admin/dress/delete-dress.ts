"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";

export async function deleteDress(dressId: string) {
  await requireAdmin();

  try {
    await prisma.dresses.delete({
      where: {
        id: dressId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(Error);
    throw new Error(message);
  }
  
}
