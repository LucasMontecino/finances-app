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
    const url = process.env.DATABASE_URL ?? "";
    const hostHint = url.includes("ngrok")
      ? "ngrok"
      : url.includes("localhost")
        ? "localhost"
        : "other";
    console.error(
      "GET /api/categories error:",
      error,
      "| DATABASE_URL set:",
      !!url,
      "| host:",
      hostHint
    );
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
