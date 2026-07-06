"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import prisma from "@/lib/prisma";

export async function getCustomer(userId: string) {
  requireAdmin();

  try {
    const customer = await prisma.user.findUnique({
        where: {
          id: userId,
        //   role: "USER",
        },
        include: {
            addresses: true,
            measurements: true,
            orders: true,
            payments: {
                include: {
                    order: true
                }
            },
        },
      });

    return customer ? customer : null ;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}
