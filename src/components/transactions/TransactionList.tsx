"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import type { Transaction, TransactionType } from "@/types";
import { useFinance } from "@/context/FinanceContext";
import {
  formatCurrency,
  formatDate,
  filterTransactions,
  sortTransactions,
} from "@/lib/utils";
import { getCategoryById } from "@/lib/categories";

interface TransactionListProps {
  onEdit?: (transaction: Transaction) => void;
}

export default function TransactionList({ onEdit }: TransactionListProps) {
  const { transactions, categories, deleteTransaction } = useFinance();
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, {
      type: typeFilter,
      category: categoryFilter,
      dateFrom,
      dateTo,
      search: searchQuery,
    });
    return sortTransactions(filtered, sortBy, sortOrder);
  }, [
    transactions,
    typeFilter,
    categoryFilter,
    dateFrom,
    dateTo,
    searchQuery,
    sortBy,
    sortOrder,
  ]);

  // Get unique categories for current type filter
  const availableCategories = useMemo(() => {
    if (typeFilter === "all") return categories;
    return categories.filter((cat) => cat.type === typeFilter);
  }, [categories, typeFilter]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        toast.success("Transaction deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete transaction");
      }
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case "income":
        return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20";
      case "expense":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
      case "asset":
        return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
      case "liability":
        return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Filters
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Type Filter */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as TransactionType | "all")
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by description or tags..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>

        {/* Sort */}
        <div className="mt-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredAndSortedTransactions.length} of{" "}
          {transactions.length} transactions
        </p>
        {(typeFilter !== "all" ||
          categoryFilter !== "all" ||
          searchQuery ||
          dateFrom ||
          dateTo) && (
          <button
            onClick={() => {
              setTypeFilter("all");
              setCategoryFilter("all");
              setSearchQuery("");
              setDateFrom("");
              setDateTo("");
            }}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-slate-600 dark:text-slate-400">
              No transactions found. Add your first transaction to get started!
            </p>
          </div>
        ) : (
          filteredAndSortedTransactions.map((transaction) => {
            const category = getCategoryById(transaction.category, categories);
            return (
              <div
                key={transaction.id}
                className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium capitalize ${getTypeColor(transaction.type)}`}
                      >
                        {transaction.type}
                      </span>
                      {category && (
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {category.name}
                        </span>
                      )}
                      {transaction.recurring && (
                        <span className="rounded bg-purple-50 px-2 py-1 text-xs font-medium text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                          Recurring
                        </span>
                      )}
                    </div>
                    <h4 className="mb-1 text-base font-medium text-slate-900 dark:text-white">
                      {transaction.description}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(transaction.date)}
                    </p>
                    {transaction.tags.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {transaction.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
