import { NextResponse } from "next/server";
import { getMeasurement } from "@/actions/measurements/get-measurement";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const param = await params;
    if (!param.id) {
      return NextResponse.json(
        { error: "measurement ID is required" },
        { status: 400 },
      );
    }

    const measurement = await getMeasurement(param.id);
    if (!measurement) {
      return NextResponse.json({ error: "measurement not found" }, { status: 404 });
    }

    return NextResponse.json(measurement, {status: 200});
  } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching measurement:", message);
    }
}
