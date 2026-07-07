import { searchPayments } from "@/actions/admin/search-payments";
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
    const orders =  await searchPayments({pagination: {page: Number(page) || 1}, searchTerm})

    return NextResponse.json(orders, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching payments:", message);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
