"use server";

import prisma from "@/lib/prisma";
import { getUserCart } from "../cart/get-user-cart";
import { getCurrentUser } from "@/lib/auth/get-current-user";

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

    let isInCart: boolean | undefined = false

    // check if it's cart
    const user = await getCurrentUser();
    if (!user) {
      return { ...dress, isInCart };
    }
    const userCart = await getUserCart()
    isInCart = userCart?.items.some( item => item.dressId === dress?.id)

    return {...dress, isInCart}

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);    
  }
}
