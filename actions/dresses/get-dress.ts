"use server";

import prisma from "@/lib/prisma";
import { getUserCart } from "../cart/get-user-cart";

export async function getDress(slug: string) {
  try {
    const dress =  await prisma.dresses.findUnique({
      where: {
        slug,
      },

      include: {
        images: true,
        reviews: true,
      },
    });

    if (!dress) {
      throw new Error("Dress not found")
    }

    // check if it's cart
    const userCart = await getUserCart()
    const isInCart = userCart?.items.some( item => item.dressId === dress?.id)

    return {...dress, isInCart}

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);    
  }
}
