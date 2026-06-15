"use server";

import prisma from "@/lib/prisma";

import { requireAdmin } from "@/lib/auth/require-admin";

type AddDressImagesData = {
  dressId: string;
  imageUrls: string[];
};

export async function addDressImages(data: AddDressImagesData) {
  await requireAdmin();

  await prisma.dress_Images.createMany({
    data: data.imageUrls.map((url, index) => ({
      dressId: data.dressId,
      url: url,
      sortOrder: index,
    })),
  });

  return {
    success: true,
  };
}
