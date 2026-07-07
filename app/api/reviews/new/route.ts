import { createReview } from "@/actions/reviews/create-review";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { data } = await request.json();
  if (!data) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const newReview = await createReview({...data, rating: Number(data.rating)})
    if (!newReview) {
        return NextResponse.json(
        { error: "Error creating review" },
        { status: 404 },
        );
    }
    if(data.type === "CUSTOMISED") {
      const updatedOrder = await prisma.custom_Order.update({
        where: { orderId: data.orderId },
        data: { review_status: "REVIEWED" },
      });
    }else if(data.type === "ORIGINAL") {
      const updatedOrder = await prisma.order_Items.update({
        where: { 
          id: data.orderItemId,
          orderId: data.orderId 
        },
        data: { review_status: "REVIEWED" },
      });
    }
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error creating Review:", message);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
