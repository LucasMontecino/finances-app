import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { mapPrismaTransactionToTransaction } from "@/lib/api-mappers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      mapPrismaTransactionToTransaction(transaction)
    );
  } catch (error) {
    console.error("GET /api/transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      type,
      category: categoryId,
      amount,
      description,
      date,
      recurring,
      frequency,
      tags,
    } = body;

    const data: Record<string, unknown> = {};
    if (type !== null && type !== undefined) data.type = type;
    if (categoryId !== null && categoryId !== undefined) data.categoryId = categoryId;
    if (amount !== null && amount !== undefined) data.amount = new Prisma.Decimal(Number(amount));
    if (description !== null && description !== undefined) data.description = description;
    if (date !== null && date !== undefined) data.date = new Date(date);
    if (recurring !== null && recurring !== undefined) data.recurring = Boolean(recurring);
    if (frequency !== null && frequency !== undefined) data.frequency = frequency;
    if (tags !== null && tags !== undefined) data.tags = Array.isArray(tags) ? tags : [];

    const transaction = await prisma.transaction.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(
      mapPrismaTransactionToTransaction(transaction)
    );
  } catch (error) {
    console.error("PUT /api/transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
