import { updateDress } from "@/actions/admin/dress/update-dress";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { dressId, ...data } = await request.json();
    if (!dressId) {
        return NextResponse.json({ error: "Dress ID is required" }, { status: 400 });
    }

    try{
        const updatedDress = await updateDress({
          dressId,
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          gender: data.gender,
          base_price: Number(data.base_price),
          stock: Number(data.stock),
          isPublished: data.isPublished,
        });

        return NextResponse.json(updatedDress, { status: 201 });
    }
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error updating dress:", message);
        return NextResponse.json({ error: "Failed to update dress" }, { status: 500 });
    }

}