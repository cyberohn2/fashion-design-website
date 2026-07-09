import { NextResponse } from "next/server";
import { createAddress } from "@/actions/addresses/create-address";

export async function POST(request: Request) {
  const { formData } = await request.json();
  if (!formData) {
    return NextResponse.json({ error: "address data required!" }, { status: 400 });
  }

  try {
    const newAddress = await createAddress(formData);
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
