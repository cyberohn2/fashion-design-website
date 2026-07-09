import { getDress } from "@/actions/dresses/get-dress";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const param = await params;
    if (!param.slug) {
      return NextResponse.json(
        { error: "Dress ID is required" },
        { status: 400 },
      );
    }

    const dress = await getDress(param.slug);

    return NextResponse.json(dress, { status: 200 });
  } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching dress details:", message);
        return NextResponse.json(
            { error: "Failed to fetch dress details" },
            { status: 500 },
        );
    }
}
