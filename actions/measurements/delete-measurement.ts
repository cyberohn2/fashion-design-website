"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export async function deleteMeasurement(measurementId: string) {
  const user = await requireAuth();

  try {
    const measurement = await prisma.user_Measurements.findFirst({
      where: {
        id: measurementId,
        userId: user.id,
      },
    });

    if (!measurement) {
      throw new Error("Measurement not found");
    }

    await prisma.user_Measurements.delete({
      where: {
        id: measurementId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message); 
  }


}
