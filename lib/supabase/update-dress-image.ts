"use client"
import { createClient } from "@/lib/supabase/client";

export async function updateDressImage({
  file,
  filePath,
}: {
  file: File;
  filePath: string;
}): Promise<{publicUrl: string, path: string}> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from("dress-images")
    .update(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("dress-images").getPublicUrl(data.path);

  return { publicUrl, path: data.path };
}
