import { initializePayment } from "@/actions/payments/initialize-payment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { orderId } = await request.json();
  if (!orderId) {
    console.log("Error here")
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const newPayment = await initializePayment(orderId);
    if (!newPayment) {
      return NextResponse.json(
        { error: "Error initializing payment" },
        { status: 404 },
      );
    }
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
