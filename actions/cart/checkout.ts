import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";
import { createReadyMadeOrder } from "../orders/create-ready-made-order";
import { clearCart } from "./clear-cart";

export async function checkoutCart({
  deliveryMethod,
  deliveryAddressId,
  notes
}: {
  deliveryMethod: "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";
  deliveryAddressId?: string
  notes?: string
}) {
  const user = await requireAuth();

  try {
    const userCart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: true
      }
    });
    if (!userCart) {
      throw new Error("No cart found!")
    }
    const dresses = userCart?.items.map( it => ({dressId: it.dressId, quantity: it.quantity}))
    if(!dresses){
        throw new Error("No items in your cart!")
    }
    const newReadyMadeOrder = await createReadyMadeOrder({dresses, deliveryMethod, deliveryAddressId, notes});
    await prisma.cart.update({
      where: {
        id: userCart?.id,
      },
      data: {
        items: {
          deleteMany: {},
        },
      },
    });

    return newReadyMadeOrder;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(Error);
    throw new Error(message);
  }
}