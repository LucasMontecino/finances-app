"use client";

import { useState } from "react";
import type { Transaction } from "@/types";
import TransactionForm from "@/components/forms/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import EditTransactionModal from "@/components/modals/EditTransactionModal";

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Transactions
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Manage your income, expenses, assets, and liabilities
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showForm ? "Hide Form" : "Add Transaction"}
            </button>
          </div>
        </div>

        {/* Add Transaction Form */}
        {showForm && (
          <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
              Add New Transaction
            </h2>
            <TransactionForm
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Transaction List */}
        <TransactionList onEdit={setEditingTransaction} />

        {/* Edit Modal */}
        {editingTransaction && (
          <EditTransactionModal
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
          />
        )}
      </div>
    </div>
  );
}
