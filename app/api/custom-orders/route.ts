import { NextResponse } from "next/server";
import { createFullCustomOrder } from "@/actions/orders/create-full-custom-order";

export async function POST(request: Request) {
  const { data } = await request.json();
  if (!data) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const newOrder = await createFullCustomOrder(data);

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
