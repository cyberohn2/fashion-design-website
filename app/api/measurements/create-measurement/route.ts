import { NextResponse } from "next/server";
import { createMeasurement } from "@/actions/measurements/create-measurement";

export async function POST(request: Request) {
  const { data } = await request.json();
  if (!data) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }

  try {
    const newMeasurement = await createMeasurement(data);
    if (!newMeasurement) {
      return NextResponse.json({ error: "Error creating measurement" }, { status: 404 });
    }
    return NextResponse.json(newMeasurement, {status: 201});
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error updating measurement:", message);
    return NextResponse.json(
      { error: "Failed to update measurement" },
      { status: 500 },
    );
  }
}
