import { initializePayment } from "@/actions/payments/initialize-payment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
console.log(orderId)
  try {
    const newPayment = await initializePayment(orderId);

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error initializing payment:", message);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 },
    );
  }
}
