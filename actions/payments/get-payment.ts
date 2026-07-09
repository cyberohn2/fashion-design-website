"use server";

import prisma from "@/lib/prisma";

import { requireAuth } from "@/lib/auth/require-auth";

export async function getPayment(ref: string) {
  const user = await requireAuth();

  try {
    const payment = await prisma.payment.findUnique({
      where: {
        Provider_Reference: ref,
        userId: user.id,
      },
    });

    return payment;

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }

}
