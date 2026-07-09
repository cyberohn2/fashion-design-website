import { NextResponse } from "next/server";
import { createMeasurement } from "@/actions/measurements/create-measurement";

export async function POST(request: Request) {
  const { formData } = await request.json();
  if (!formData) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }

  try {
    const newMeasurement = await createMeasurement(formData);

    return NextResponse.json(newMeasurement, {status: 201});
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error creating measurement:", message);
    return NextResponse.json(
      { error: "Failed to create measurement" },
      { status: 500 },
    );
  }
}
