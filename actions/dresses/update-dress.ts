"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";

type UpdateDressData = {
  dressId: string;

  title?: string;
  description?: string;
  category:
    | "FEMALE_NATIVE"
    | "MALE_NATIVE"
    | "CORPORATE_MALE"
    | "CORPORATE_FEMALE"
    | "CASUAL"
    | "STREET_WEAR";
  basePrice?: number;
  stockQuantity?: number;
  isPublished?: boolean;
};

export async function updateDress(data: UpdateDressData) {
  await requireAdmin();

  return prisma.dresses.update({
    where: {
      id: data.dressId,
    },

    data,
  });
}
