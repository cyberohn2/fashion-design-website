"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

type UpdateMeasurementData = {
  measurementId: string;

  profileName?: string;

  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeveLength: number;
  arm?: number;
  sleeveHem?: number;
  topLength?: number;
  thigh: number;
  trouserLength: number;
  ankle: number;
  waistToKnee: number;
  kneeToAnkle: number;
  roundKnee: number;
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
      profileName: data.profileName,

      chest: data.chest,
      waist: data.waist,
      hips: data.hips,
      shoulder: data.shoulder,
      sleeveLength: data.sleeveLength,
      arm: data.arm,
      sleeveHem: data.sleeveHem,
      topLength: data.topLength,
      thigh: data.thigh,
      trouserLength: data.trouserLength,
      ankle: data.ankle,
      waistToKnee: data.waistToKnee,
      kneeToAnkle: data.kneeToAnkle,
      roundKnee: data.roundKnee,
      neck: data.neck,
      inseam: data.inseam,
      height: data.height,

      notes: data.notes,
    },
  });
}
