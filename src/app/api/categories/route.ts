import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mapPrismaCategoryToCategory } from "@/lib/api-mappers";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    const mapped = categories.map(mapPrismaCategoryToCategory);
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
