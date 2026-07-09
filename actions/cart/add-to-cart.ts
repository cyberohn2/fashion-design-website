import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";

export async function addToCart({item}:{item: {dressId: string; quantity: number;}}) {
    const user = await requireAuth()
    
    try {
        // validate quantity
        if (item.quantity <= 0) {
          throw new Error("Quantity must be greater than zero.");
        }
      // get user cart
      const userCart = await prisma.cart.findUnique({
        where: {
          userId: user.id,
        },
        include: {
          items: true,
        },
      });

      // find dress
      const dress = await prisma.dresses.findUnique({
        where: {
          id: item.dressId,
        },
      });
      if (!dress) {
        throw new Error("Dress not found!");
      }

    //   check stock
    if (dress.stock < item.quantity) {
      throw new Error("Not enough stock.");
    }

      // create new cart for user with no cart and add item to cart
      if (!userCart) {
        const newUserCart = await prisma.cart.create({
          data: {
            userId: user.id,
            items: {
              create: {
                dressId: item.dressId,
                quantity: item.quantity,
              },
            },
          },
        });

        return newUserCart;
      }

      // add items to cart if user already has a cart

    //   existing cart item
      const cartItem = userCart.items.find( it => it.dressId === item.dressId) 
      const newUserCart = await prisma.cart.update({
        where: {
          id: userCart.id,
        },
        data: {
          items: cartItem
            ? {
                update: {
                  where: {
                    id: cartItem?.id,
                  },
                  data: {
                    quantity: {
                      increment: item.quantity,
                    },
                  },
                },
              }
            : {
                create: {
                  dressId: item.dressId,
                  quantity: item.quantity,
                },
              },
        },
      });
      return newUserCart;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.log(message)
    }
}