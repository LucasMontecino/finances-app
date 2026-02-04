"use client";

import { useFinance } from "@/context/FinanceContext";

export default function DatabaseErrorBanner() {
  const { error, refetch } = useFinance();

  if (!error) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Database connection issue:</strong> {error}. Make sure
          PostgreSQL is running and you have run{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">
            npm run db:migrate
          </code>{" "}
          and{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/40">
            npm run db:seed
          </code>
          .
        </p>
        <button
          onClick={() => refetch()}
          className="shrink-0 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
