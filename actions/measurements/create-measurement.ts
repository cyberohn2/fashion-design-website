"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

type CreateMeasurementData = {
  profileName: string;

  gender: "MALE" | "FEMALE" | "UNISEX";

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

export async function createMeasurement(data: CreateMeasurementData) {
  const user = await requireAuth();

  const measurement = await prisma.user_Measurements.create({
    data: {
      userId: user.id,

      profile_name: data.profileName,

      gender: data.gender,

      chest: data.chest,
      waist: data.waist,
      hips: data.hips,
      shoulder: data.shoulder,
      sleeve_length: data.sleeveLength,
      arm: data.arm,
      sleeve_hem: data.sleeveHem,
      top_length: data.topLength,
      thigh: data.thigh,
      trouser_length: data.trouserLength,
      ankle: data.ankle,
      waist_to_knee: data.waistToKnee,
      knee_to_ankle: data.kneeToAnkle,
      round_knee: data.roundKnee,
      neck: data.neck,
      inseam: data.inseam,
      height: data.height,

      notes: data.notes,
    },
  });

  return measurement;
}
