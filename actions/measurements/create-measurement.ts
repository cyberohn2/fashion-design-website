"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export type CreateMeasurementData = {
  profile_name: string;

  gender: string;

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

export async function createMeasurement(data: CreateMeasurementData) {
  const user = await requireAuth();

  const measurement = await prisma.user_Measurements.create({
    data: {
      userId: user.id,

      profile_name: data.profile_name,

      gender: data.gender,

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

  return measurement;
}
