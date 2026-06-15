"use server";

import prisma from "@/lib/prisma";

import slugify from "slugify";

import { requireAdmin } from "@/lib/auth/require-admin";

type CreateDressData = {
  title: string;
  description: string;
  category: "FEMALE_NATIVE" | "MALE_NATIVE" | "CORPORATE_MALE" | "CORPORATE_FEMALE" | "CASUAL" | "STREET_WEAR";
  gender: "MALE" | "FEMALE" | "UNISEX";
  basePrice: number;
  stockQuantity: number;
  thumbnailUrl?: string;
};

export async function createDress(data: CreateDressData) {
  const admin = await requireAdmin();

  const slug = slugify(data.title, {
    lower: true,
    strict: true,
  });

  const dress = await prisma.dresses.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      category: data.category,
      gender: data.gender,
      base_price: data.basePrice,
      stock: data.stockQuantity,
      thumbnail: data.thumbnailUrl,
    },
  });

  return dress;
}
