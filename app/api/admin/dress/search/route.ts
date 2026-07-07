import { searchDresses } from "@/actions/admin/search-dress";
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
    const dresses = await searchDresses({
      pagination: { page: Number(page) || 1 },
      searchTerm,
    });

    return NextResponse.json(dresses, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching dresses:", message);
    return NextResponse.json(
      { error: "Failed to fetch dresses" },
      { status: 500 },
    );
  }
}
