import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";
import { createReadyMadeOrder } from "../orders/create-ready-made-order";

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
    const dresses = userCart?.items.map( it => ({dressId: it.dressId, quantity: it.quantity}))
    if(!dresses){
        throw new Error("No items in your cart!")
    }
    const newReadyMadeOrder = await createReadyMadeOrder({dresses, deliveryMethod, deliveryAddressId, notes});
    if (!newReadyMadeOrder){
        throw new Error("Error creating order!")
    }

    return newReadyMadeOrder;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
  }
}