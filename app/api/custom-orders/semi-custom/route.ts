import { NextResponse } from "next/server";
import { createSemiCustomOrder } from "@/actions/orders/create-semi-custom-order";

export async function POST(request: Request) {
  const { data } = await request.json();
  console.log("Received data for new semi-custom order:", data);
  if (!data) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const newSemiOrder = await createSemiCustomOrder(data);
    if (!newSemiOrder) {
      return NextResponse.json(
        { error: "Error creating order" },
        { status: 404 },
      );
    }
    return NextResponse.json(newSemiOrder, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error creating order:", message);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
