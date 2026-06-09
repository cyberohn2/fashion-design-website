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
      sleeveLength: data.sleeve_length,
      arm: data.arm,
      sleeveHem: data.sleeve_hem,
      topLength: data.top_length,
      thigh: data.thigh,
      trouserLength: data.trouser_length,
      ankle: data.ankle,
      waistToKnee: data.waist_to_knee,
      kneeToAnkle: data.knee_to_ankle,
      roundKnee: data.round_knee,
      neck: data.neck,
      inseam: data.inseam,
      height: data.height,

      notes: data.notes,
    },
  });
}
