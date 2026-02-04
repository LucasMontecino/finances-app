import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { FinancialSummary } from "@/types";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany();

    const summary: FinancialSummary = {
      totalIncome: 0,
      totalExpenses: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      currentBalance: 0,
      netWorth: 0,
    };

    transactions.forEach((t) => {
      const amount = Number(t.amount);
      switch (t.type) {
        case "income":
          summary.totalIncome += amount;
          break;
        case "expense":
          summary.totalExpenses += amount;
          break;
        case "asset":
          summary.totalAssets += amount;
          break;
        case "liability":
          summary.totalLiabilities += amount;
          break;
      }
    });

    summary.currentBalance = summary.totalIncome - summary.totalExpenses;
    summary.netWorth = summary.totalAssets - summary.totalLiabilities;

    return NextResponse.json(summary);
  } catch (error) {
    console.error("GET /api/summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
