import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const dresses = await prisma.dresses.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
            category: query.category,
          },
        ],
        isPublished: true
      },

      include: {
        images: true,
        reviews: true,
      },
    });
    return NextResponse.json(dresses)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Search error:", message);
  }

}
