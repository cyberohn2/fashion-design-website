"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";

export async function getCustomers() {
  const admin = requireAdmin();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const customers = await prisma.user.findMany({
      where: {
        role: "USER",
      },
    });

    return customers;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
