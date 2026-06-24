import { NextResponse } from "next/server";
import { updateDress } from "@/actions/admin/update-dress";

export async function POST(request: Request) {
    const { dressId, ...data } = await request.json();
    if (!dressId) {
        return NextResponse.json({ error: "Dress ID is required" }, { status: 400 });
    }

    try{
        const updatedDress = await updateDress({ dressId, ...data });
        if (!updatedDress) {
          return NextResponse.json(
            { error: "dress not found" },
            { status: 404 },
          );
        }
        return NextResponse.json(updatedDress, { status: 201 });
    }
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error updating dress:", message);
        return NextResponse.json({ error: "Failed to update dress" }, { status: 500 });
    }

}