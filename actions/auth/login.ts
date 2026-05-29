"use server";

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

  return {
    success: true,
  };
}
