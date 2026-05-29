"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export async function deleteMeasurement(measurementId: string) {
  const user = await requireAuth();

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
}
