import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";

export async function removeFromCart({
  item,
}: {
  item: { dressId: string;};
}) {
  const user = await requireAuth();

  try {
    // get user cart
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

    // check if item is already in cart then update it's quantity instead else delete it
    const isInCart = userCart?.items.some((it) => it.dressId === item.dressId);
    if (!isInCart) {
        throw new Error("Item is not in cart")
    }
    //   existing cart item
    const cartItem = userCart.items.find((it) => it.dressId === item.dressId);

    const newUserCart = await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        items:
          Number(cartItem?.quantity) > 1
            ? {
                update: {
                  where: {
                    id: cartItem?.id,
                  },
                  data: {
                    quantity: { decrement: 1 },
                  },
                },
              }
            : {
                delete: { id: cartItem?.id },
              },
      },
    });
    return newUserCart;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
  }
}