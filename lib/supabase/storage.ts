import { createClient } from "@/lib/supabase/server";

export async function uploadDressImage(file: File) {
  const supabase = await createClient();

  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("dress-images")
    .upload(`dresses/${fileName}`, file);

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("dress-images").getPublicUrl(data.path);

  return publicUrl;
}
