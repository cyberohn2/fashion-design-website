import { NextResponse } from "next/server";
import { createReadyMadeOrder } from "@/actions/orders/create-ready-made-order";

export async function POST(request: Request) {
  const { data } = await request.json();
  if (!data) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const newOrder = await createReadyMadeOrder({
      dresses: data.dresses,
      notes: data.notes,
      deliveryMethod: data.deliveryMethod,
      deliveryAddressId: data.deliveryAddressId,
    });
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error creating order:", message);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
