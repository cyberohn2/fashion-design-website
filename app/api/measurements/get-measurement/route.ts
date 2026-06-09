import { getMeasurements } from "@/actions/measurements/get-measurements";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const measurements = await getMeasurements();
    if (!measurements) {
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(measurements, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching measurements:", message);
    return NextResponse.json(
      { error: "Failed to fetch measurements" },
      { status: 500 },
    );
  }
}
