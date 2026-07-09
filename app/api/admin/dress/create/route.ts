import { createDress } from "@/actions/admin/dress/create-dress";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const dressData = await req.formData();
  if (!dressData) {
    return NextResponse.json({ error: "empty request" }, { status: 400 });
  }

  try {
    const newDressData = {
      title: dressData.get("title") as string,
      description: dressData.get("description") as string,
      category: dressData.get("category") as string,
      type: dressData.get("type") as string,
      gender: dressData.get("gender") as string,
      basePrice: Number(dressData.get("basePrice")),
      stockQuantity: Number(dressData.get("stock")),
      images: dressData.getAll("images") as File[],
    };
    const newDress = await createDress(newDressData);
    return NextResponse.json(newDress, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error creating dress:", message);
    return NextResponse.json(
      { error: "Server Error: couldn't create dress" },
      { status: 500 },
    );
  }
}
