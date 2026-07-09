import { getAllOrders } from "@/actions/admin/order/get-all-orders";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { searchTerm, page } = await req.json();
  if (!searchTerm) {
    return NextResponse.json(
      { error: "search term required!" },
      { status: 400 },
    );
  }

  try {
    const orders = await getAllOrders({
      pagination: { page: Number(page) || 1 },
      searchTerm,
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching orders:", message);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
