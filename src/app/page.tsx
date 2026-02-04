"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useFinance } from "@/context/FinanceContext";
import {
  formatCurrency,
  getMonthRange,
  getYearRange,
  filterByDateRange,
  calculateSummary,
  getExpensesByCategory,
  getMonthlyTrend,
} from "@/lib/utils";
import IncomeVsExpensesChart from "@/components/charts/IncomeVsExpensesChart";
import ExpenseByCategoryChart from "@/components/charts/ExpenseByCategoryChart";
import { toast } from "sonner";

type PeriodKey = "this_month" | "last_month" | "this_year" | "all";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "this_month", label: "This month" },
  { key: "last_month", label: "Last month" },
  { key: "this_year", label: "This year" },
  { key: "all", label: "All time" },
];

function getPeriodRange(period: PeriodKey): { start: string; end: string } | null {
  const now = new Date();
  switch (period) {
    case "this_month":
      return getMonthRange(now.getFullYear(), now.getMonth() + 1);
    case "last_month": {
      const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return getMonthRange(d.getFullYear(), d.getMonth() + 1);
    }
    case "this_year":
      return getYearRange(now.getFullYear());
    case "all":
      return null;
  }
}

export default function Home() {
  const { summary, transactions, categories, isLoading, refetch } = useFinance();
  const [period, setPeriod] = useState<PeriodKey>("this_month");

  const range = getPeriodRange(period);
  const filteredTransactions = useMemo(() => {
    if (!range) return transactions;
    return filterByDateRange(transactions, range.start, range.end);
  }, [transactions, range]);

  const periodSummary = useMemo(
    () => calculateSummary(filteredTransactions),
    [filteredTransactions]
  );

  const monthlyTrendData = useMemo(
    () => getMonthlyTrend(transactions, 6),
    [transactions]
  );

  const categoryNames = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => (map[c.id] = c.name));
    return map;
  }, [categories]);

  const expenseByCategoryData = useMemo(
    () => getExpensesByCategory(filteredTransactions, categoryNames),
    [filteredTransactions, categoryNames]
  );

  const recentTransactions = useMemo(
    () =>
      [...filteredTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [filteredTransactions]
  );

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      transactions,
      categories,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finances-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const list = Array.isArray(data.transactions) ? data.transactions : [];
      if (list.length === 0) {
        toast.error("No transactions found in file");
        e.target.value = "";
        return;
      }
      const res = await fetch("/api/transactions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: list }),
      });
      if (!res.ok) throw new Error("Import failed");
      const result = await res.json();
      await refetch();
      toast.success(`Imported ${result.imported} transactions`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    }
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </main>
    );
  }

  const summaryCards = [
    {
      title: "Total Income",
      amount: periodSummary.totalIncome,
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Total Expenses",
      amount: periodSummary.totalExpenses,
      color: "from-red-500 to-rose-600",
    },
    {
      title: "Balance",
      amount: periodSummary.currentBalance,
      color: "from-purple-500 to-violet-600",
    },
    {
      title: "Net Worth",
      amount: summary.netWorth,
      color: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            Overview of your finances. Use the period filter to focus on a
            specific time range.
          </p>
        </header>

        {/* Period filter */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Period:
          </span>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === p.key
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div
                className={`mb-3 inline-block rounded-lg bg-gradient-to-r ${card.color} px-3 py-1 text-sm font-medium text-white`}
              >
                {card.title}
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(card.amount)}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Income vs Expenses (last 6 months)
            </h2>
            <IncomeVsExpensesChart data={monthlyTrendData} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Expenses by category
            </h2>
            <ExpenseByCategoryChart data={expenseByCategoryData} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/transactions"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-2xl">💰</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Add Income
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Record your earnings
            </p>
          </Link>
          <Link
            href="/transactions"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-2xl">💸</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Add Expense
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Track your spending
            </p>
          </Link>
          <Link
            href="/transactions"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-2xl">🏦</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Add Asset
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Record what you own
            </p>
          </Link>
          <Link
            href="/transactions"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-2xl">📋</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Add Liability
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Track your debts
            </p>
          </Link>
        </div>

        {/* Export / Import */}
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Backup & restore
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExport}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              Export data (JSON)
            </button>
            <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
              Import from file
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Export downloads your transactions and categories. Import adds
            transactions from a previously exported JSON file.
          </p>
        </div>

        {/* Recent transactions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Recent transactions
              {range && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({PERIODS.find((p) => p.key === period)?.label})
                </span>
              )}
            </h2>
            <Link
              href="/transactions"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No transactions in this period. Add your first transaction or
                choose another period.
              </p>
              <Link
                href="/transactions"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add transaction
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const typeColors: Record<string, string> = {
                  income:
                    "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
                  expense:
                    "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
                  asset:
                    "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
                  liability:
                    "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
                };
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium capitalize ${typeColors[transaction.type] ?? ""}`}
                      >
                        {transaction.type}
                      </span>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
