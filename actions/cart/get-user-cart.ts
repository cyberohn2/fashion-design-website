import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";

export async function getUserCart() {
    const user = await requireAuth()

    try {
        const userCart = prisma.cart.findUnique({
          where: {
            userId: user.id,
          },
          include: {
            items: {
                include: {
                    dress: true
                }
            }
          }
        });

        if (!userCart) {
          const newUserCart = await prisma.cart.create({
            data: {
              userId: user.id,
            },
            include: {
                items: {
                    include: {
                        dress: true
                    }
                }
            }
          });

          return newUserCart;
        }
        return userCart;

    } catch (error) {
      const message = error instanceof Error ? error.message : String(Error);
      throw new Error(message);
    }
}