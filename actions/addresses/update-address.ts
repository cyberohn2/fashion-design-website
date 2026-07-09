"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

type UpdateAddressData = {
  addressId: string;

  full_name?: string;
  phone?: string;

  country?: string;
  state?: string;
  city?: string;
  address: string;

  postal_code?: string;

  is_default?: boolean;
};

export async function updateAddress(data: UpdateAddressData) {
  const user = await requireAuth();

  try {
    const dbTx = await prisma.$transaction(async (tx) => {
    // Handle default address switching
      if (data.is_default) {
        await tx.user_Addresses.updateMany({
          where: {
            userId: user.id,
            is_default: true,
          },

          data: {
            is_default: false,
          },
        });
      }

      return tx.user_Addresses.update({
        where: {
          id: data.addressId,
        },

        data: {
          full_name: data.full_name,
          phone: data.phone,

          country: data.country,
          state: data.state,
          city: data.city,

          address: data.address,

          postal_code: data.postal_code,

          is_default: data.is_default,
        },
      });
    })
    return dbTx
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }

  
}
