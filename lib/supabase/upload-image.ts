"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const filePath = `custom-orders/${fileName}`;

  const { error } = await supabase.storage
    .from("custom-order-images")
    .upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("custom-order-images").getPublicUrl(filePath);

  return publicUrl;
}
