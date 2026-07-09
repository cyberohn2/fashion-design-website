import { deleteFromCart } from "@/actions/cart/delete-from-cart";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { data } = await request.json();
  if (!data) {
    return NextResponse.json({ error: "item data required!" }, { status: 400 });
  }

  try {
    const newCart = await deleteFromCart({itemId: data});

    return NextResponse.json(newCart, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error removing item from cart:", message);
    return NextResponse.json(
      { error: "Error removing item from cart" },
      { status: 500 },
    );
  }
}
