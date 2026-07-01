"use server";

import prisma from "@/lib/prisma";
import slugify from "slugify";
import { requireAdmin } from "@/lib/auth/require-admin";
import { uploadDressImage } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/server";

export type gender = "MALE" | "FEMALE" | "UNISEX"
export type dressCategory =
  | "FEMALE_NATIVE"
  | "MALE_NATIVE"
  | "CORPORATE_MALE"
  | "CORPORATE_FEMALE"
  | "CASUAL"
  | "STREET_WEAR";
export type dressType = "BESPOKE" | "KAFTAN" | "MONOGRAM" | "NATIVE" | "READYMADE";
 
export type CreateDressData = {
  title: string;
  description: string;
  category: dressCategory | string;
  type: dressType | string;
  gender: gender | string;
  basePrice: number;
  stockQuantity: number;
  images?: File[];
};

export async function createDress(data: CreateDressData) {
  await requireAdmin();
  const supabase = await createClient();

  if (!data.images?.length) {
    throw new Error("At least one image is required");
  }
  if(data.images?.length > 5){
    throw new Error("Maximum of 5 images required!")
  }

  const uploadedFiles: string[] = [];
  const imageUrls: string[] = [];

  try {
    // create slug first
    const baseSlug = slugify(data.title, {
      lower: true,
      strict: true,
    });
    const slug = `${baseSlug}-${crypto.randomUUID()}`;

    // Upload images
    const uploadedImages = await Promise.all(
      data.images?.map((image) =>
        uploadDressImage({
          file: image,
          slug,
        }),
      ),
    );

    uploadedImages.forEach( image => {
      imageUrls.push(image.publicUrl)
      uploadedFiles.push(image.path)
    })

    const result = await prisma.$transaction(async (tx) => {
      const dress = await tx.dresses.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          category: data.category as dressCategory,
          type: data.type as dressType,
          gender: data.gender as gender,
          base_price: data.basePrice,
          stock: data.stockQuantity,
          thumbnail: imageUrls[0],
          isPublished: true,

          images: {
            create: imageUrls.map((url, index) => ({
              url,
              storagePath: uploadedFiles[index]
            })),
          },
        },

        include: {
          images: true,
        },
      });

      return dress
    });

    return {
      success: true,
      dress: result,
    };
  } catch (error) {
    // Rollback uploaded files
    if (uploadedFiles.length) {
      await supabase.storage.from("dress-images").remove(uploadedFiles);
    }

    throw error;
  }
}
