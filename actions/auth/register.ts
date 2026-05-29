"use server";

import  prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type RegisterData = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

export async function registerUser(data: RegisterData) {
  const supabase = await createClient();

  // 1. Create auth user in Supabase
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!authData.user) {
    throw new Error("User creation failed");
  }

  // 2. Create profile in Prisma DB
  await prisma.user.create({
    data: {
      id: authData.user.id,
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      role: "USER",
    },
  });

  return {
    success: true,
  };
}
