import { NextResponse } from "next/server";
import { createAddress } from "@/actions/addresses/create-address";

export async function POST(request: Request) {
  const { formData } = await request.json();
  console.log("Received data for new address:", formData);
  if (!formData) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const newAddress = await createAddress(formData);
    if (!newAddress) {
      return NextResponse.json({ error: "Error creating address" }, { status: 404 });
    }
    return NextResponse.json(newAddress, {status: 201});
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error updating address:", message);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}
