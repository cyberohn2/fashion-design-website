import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";

export async function deleteFromCart({
  itemId,
}: {
  itemId: string;
}) {
  const user = await requireAuth();

  try {
    // get the cart item
    const userCart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (!userCart) {
      throw new Error("Cart not found!")
    }

    // check if item is already in cart 
    const isInCart = userCart?.items.some((it) => it.id === itemId);
    if (!isInCart) {
        return userCart;
    }

    const newUserCart = await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        items: {
          delete: { id: itemId },
        },
      },
    });
    return newUserCart;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(Error);
    throw new Error(message);
  }
}