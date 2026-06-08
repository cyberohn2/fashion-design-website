"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

export type CreateAddressData = {
  fullName: string;
  phone: string;

  country: string;
  state: string;
  city: string;

  address: string;

  postalCode?: string;

  isDefault?: boolean;
};

export async function createAddress(data: CreateAddressData) {
  const user = await requireAuth();

  // Remove previous default address
  if (data.isDefault) {
    await prisma.user_Addresses.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },

      data: {
        isDefault: false,
      },
    });
  }

  const address = await prisma.user_Addresses.create({
    data: {
      userId: user.id,

      full_name: data.fullName,
      phone: data.phone,

      country: data.country,
      state: data.state,
      city: data.city,

      address: data.address,

      postal_code: data.postalCode,

      isDefault: data.isDefault ?? false,
    },
  });

  return address;
}
