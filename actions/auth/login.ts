"use server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

type LoginData = {
  email: string;
  password: string;
};

export async function loginUser(data: LoginData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }
  const user = await getCurrentUser();

  return {
    success: true,
    user: user
  };
}
