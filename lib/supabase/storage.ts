"use server"
import { createClient } from "@/lib/supabase/server";

export async function uploadDressImage({file, slug}: {file: File, slug: string}) {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${slug}-${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("dress-images")
    .upload(`dresses/${fileName}`, file);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("dress-images").getPublicUrl(data.path);

  return {publicUrl, path: data.path};
}
