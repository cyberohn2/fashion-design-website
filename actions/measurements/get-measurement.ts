"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export async function getMeasurement(measurementId: string) {
  const user = await requireAuth();

  try {
    const measurement = await prisma.user_Measurements.findFirst({
      where: {
        id: measurementId,
        userId: user.id,
      },
    });

    return measurement;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message); 
  }

}
