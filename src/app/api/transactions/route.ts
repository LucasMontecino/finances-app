import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mapPrismaTransactionToTransaction } from "@/lib/api-mappers";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true },
      orderBy: { date: "desc" },
    });
    const mapped = transactions.map(mapPrismaTransactionToTransaction);
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      category: categoryId,
      amount,
      description,
      date,
      recurring = false,
      frequency = null,
      tags = [],
    } = body;

    if (
      !type ||
      !categoryId ||
      amount === null ||
      amount === undefined ||
      !description ||
      !date
    ) {
      return NextResponse.json(
        { error: "Missing required fields: type, category, amount, description, date" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        categoryId,
        amount: new Prisma.Decimal(Number(amount)),
        description,
        date: new Date(date),
        recurring: Boolean(recurring),
        frequency: recurring ? frequency : null,
        tags: Array.isArray(tags) ? tags : [],
      },
      include: { category: true },
    });

    return NextResponse.json(
      mapPrismaTransactionToTransaction(transaction)
    );
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
