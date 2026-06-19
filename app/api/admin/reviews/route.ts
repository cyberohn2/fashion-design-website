import { getReviews } from "@/actions/admin/get-reviews";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url)
    const page = searchParams.get("page") ?? 1

  try {
    const reviews =  await getReviews({pagination: {page: Number(page)}})

    return NextResponse.json(reviews, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching reviews:", message);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
