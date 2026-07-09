import { clearCart } from "@/actions/cart/clear-cart";
import { NextResponse } from "next/server";

export async function GET() {

  try {
    const cart = await clearCart();

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error clearing cart:", message);
    return NextResponse.json({ error: "Error clearing cart" }, { status: 500 });
  }
}
