"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

type UpdateMeasurementData = {
  measurementId: string;

  profile_name?: string;

  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeve_length: number;
  arm?: number;
  sleeve_hem?: number;
  top_length?: number;
  thigh: number;
  trouser_length: number;
  ankle: number;
  waist_to_knee: number;
  knee_to_ankle: number;
  round_knee: number;
  neck: number;
  inseam?: number;
  height?: number;

  notes?: string;
};

export async function updateMeasurement(data: UpdateMeasurementData) {
  const user = await requireAuth();

  try {
    const existingMeasurement = await prisma.user_Measurements.findFirst({
      where: {
        id: data.measurementId,
        userId: user.id,
      },
    });

    if (!existingMeasurement) {
      throw new Error("Measurement not found");
    }

    return prisma.user_Measurements.update({
      where: {
        id: data.measurementId,
      },

      data: {
        profile_name: data.profile_name,

        chest: data.chest,
        waist: data.waist,
        hips: data.hips,
        shoulder: data.shoulder,
        sleeve_length: data.sleeve_length,
        arm: data.arm,
        sleeve_hem: data.sleeve_hem,
        top_length: data.top_length,
        thigh: data.thigh,
        trouser_length: data.trouser_length,
        ankle: data.ankle,
        waist_to_knee: data.waist_to_knee,
        knee_to_ankle: data.knee_to_ankle,
        round_knee: data.round_knee,
        neck: data.neck,
        inseam: data.inseam,
        height: data.height,

        notes: data.notes,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message); 
  } 
}
