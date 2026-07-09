import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";

export async function clearCart() {
  const user = await requireAuth();

  try {
    const userCart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userCart) {
      throw new Error("Cart not found!");
    }

    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        items: {
          deleteMany: {},
        },
      },
    });

    return {
      success: true,
      message: "Cart cleared successfully.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(Error);
    throw new Error(message);
  }
}
