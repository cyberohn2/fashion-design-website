import { addToCart } from "@/actions/cart/add-to-cart";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { data } = await request.json();
  if (!data) {
    return NextResponse.json({ error: "item data required!" }, { status: 400 });
  }

  try {
    const newCart = await addToCart({item: data});

    return NextResponse.json(newCart, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error adding item to cart:", message);
    return NextResponse.json(
      { error: "Error adding item to cart" },
      { status: 500 },
    );
  }
}
