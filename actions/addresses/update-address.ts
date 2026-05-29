"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/require-auth";

type UpdateAddressData = {
  addressId: string;

  fullName?: string;
  phone?: string;

  country?: string;
  state?: string;
  city?: string;
  address: string;

  postalCode?: string;

  isDefault?: boolean;
};

export async function updateAddress(data: UpdateAddressData) {
  const user = await requireAuth();

  const existingAddress = await prisma.user_Addresses.findFirst({
    where: {
      id: data.addressId,
      userId: user.id,
    },
  });

  if (!existingAddress) {
    throw new Error("Address not found");
  }

  // Handle default address switching
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

  return prisma.user_Addresses.update({
    where: {
      id: data.addressId,
    },

    data: {
      fullName: data.fullName,
      phone: data.phone,

      country: data.country,
      state: data.state,
      city: data.city,

      address: data.address,

      postalCode: data.postalCode,

      isDefault: data.isDefault,
    },
  });
}
