import { searchCustomers } from "@/actions/admin/search-customers";
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
    const customers =  await searchCustomers({pagination: {page: Number(page) || 1}, searchTerm})

    return NextResponse.json(customers, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching customers:", message);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
