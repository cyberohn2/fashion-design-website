"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export type CreateAddressData = {
  full_name: string;
  phone: string;

  country: string;
  state: string;
  city: string;

  address: string;

  postal_code?: string;

  is_default?: boolean;
};

export async function createAddress(data: CreateAddressData) {
  const user = await requireAuth();

  // Remove previous default address
  if (data.is_default) {
    await prisma.user_Addresses.updateMany({
      where: {
        userId: user.id,
        is_default: true,
      },

      data: {
        is_default: false,
      },
    });
  }

  const address = await prisma.user_Addresses.create({
    data: {
      userId: user.id,

      full_name: data.full_name,
      phone: data.phone,

      country: data.country,
      state: data.state,
      city: data.city,

      address: data.address,

      postal_code: data.postal_code,

      is_default: data.is_default ?? false,
    },
  });

  return address;
}
