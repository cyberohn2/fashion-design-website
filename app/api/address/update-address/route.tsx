import { NextResponse } from "next/server";
import { updateAddress } from "@/actions/addresses/update-address";

export async function POST(request: Request) {
    const { addressId, ...data } = await request.json();
    if (!addressId) {
        return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    try{
        const updatedAddress = await updateAddress({ addressId, ...data });
        return NextResponse.json(updatedAddress, {status: 201});
    }
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error updating address:", message);
        return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
    }

}