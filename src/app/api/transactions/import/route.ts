import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import type {
  Transaction as PrismaTransaction,
  Category as PrismaCategory,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { mapPrismaTransactionToTransaction } from "@/lib/api-mappers";

type TransactionWithCategory = PrismaTransaction & { category: PrismaCategory };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactions: rawTransactions } = body as {
      transactions: Array<{
        type: string;
        category: string;
        amount: number;
        description: string;
        date: string;
        recurring?: boolean;
        frequency?: string | null;
        tags?: string[];
      }>;
    };

    if (!Array.isArray(rawTransactions)) {
      return NextResponse.json(
        { error: "Request body must contain a 'transactions' array" },
        { status: 400 }
      );
    }

    const created: TransactionWithCategory[] = [];

    for (const t of rawTransactions) {
      const hasAmount =
        t.amount !== undefined &&
        t.amount !== null &&
        !Number.isNaN(Number(t.amount));
      if (!t.type || !t.category || !hasAmount || !t.description || !t.date) {
        continue;
      }
      const transaction = await prisma.transaction.create({
        data: {
          type: t.type,
          categoryId: t.category,
          amount: new Prisma.Decimal(Number(t.amount)),
          description: t.description,
          date: new Date(t.date),
          recurring: Boolean(t.recurring),
          frequency: t.recurring ? (t.frequency ?? null) : null,
          tags: Array.isArray(t.tags) ? t.tags : [],
        },
        include: { category: true },
      });
      created.push(transaction);
    }

    const mapped = created.map(mapPrismaTransactionToTransaction);
    return NextResponse.json({ imported: mapped.length, transactions: mapped });
  } catch (error) {
    console.error("POST /api/transactions/import error:", error);
    return NextResponse.json(
      { error: "Failed to import transactions" },
      { status: 500 }
    );
  }
}
