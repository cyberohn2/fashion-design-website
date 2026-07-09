import { checkoutCart } from "@/actions/cart/checkout";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { data } = await request.json();
  if (!data) {
    return NextResponse.json({ error: "delivery method and or address required!" }, { status: 400 });
  }

  try {
    const newReadyMadeOrder = await checkoutCart(data);

    return NextResponse.json(newReadyMadeOrder, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error checking out items", message);
    return NextResponse.json(
      { error: "Error adding item to cart" },
      { status: 500 },
    );
  }
}
