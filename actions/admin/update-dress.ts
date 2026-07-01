"use server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import slugify from "slugify";
import { gender } from "./create-dress";

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
  type: "BESPOKE" | "KAFTAN" | "MONOGRAM" | "NATIVE" | "READYMADE";
  gender: gender;
  base_price?: number;
  stock?: number;
  isPublished?: boolean;
};

export async function updateDress(data: UpdateDressData) {
  await requireAdmin();

  try {
    const baseSlug = slugify(data?.title as string, {
      lower: true,
      strict: true,
    });
    const slug = `${baseSlug}-${crypto.randomUUID()}`;

    return prisma.dresses.update({
      where: {
        id: data.dressId,
      },

      data: {
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        gender: data.gender,
        base_price: data.base_price,
        stock: data.stock,
        isPublished: data.isPublished,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.log(message)
  }
}
