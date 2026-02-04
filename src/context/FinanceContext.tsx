"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Transaction, Category, FinancialSummary } from "@/types";
import { calculateSummary } from "@/lib/utils";

const API_BASE = "";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  summary: FinancialSummary;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    currentBalance: 0,
    netWorth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setError(null);
    try {
      const [txRes, catRes] = await Promise.all([
        fetchJson<Transaction[]>(`${API_BASE}/api/transactions`),
        fetchJson<Category[]>(`${API_BASE}/api/categories`),
      ]);
      setTransactions(txRes);
      setCategories(catRes);
      setSummary(calculateSummary(txRes));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
      setTransactions([]);
      setCategories([]);
      setSummary({
        totalIncome: 0,
        totalExpenses: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        currentBalance: 0,
        netWorth: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isLoading) {
      setSummary(calculateSummary(transactions));
    }
  }, [transactions, isLoading]);

  const addTransaction = useCallback(async (transaction: Transaction) => {
    const body = {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
      recurring: transaction.recurring,
      frequency: transaction.frequency,
      tags: transaction.tags,
    };
    const created = await fetchJson<Transaction>(`${API_BASE}/api/transactions`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    setTransactions((prev) => [created, ...prev]);
  }, []);

  const updateTransaction = useCallback(
    async (id: string, updates: Partial<Transaction>) => {
      const body: Record<string, unknown> = {};
      if (updates.type !== null && updates.type !== undefined) body.type = updates.type;
      if (updates.category !== null && updates.category !== undefined) body.category = updates.category;
      if (updates.amount !== null && updates.amount !== undefined) body.amount = updates.amount;
      if (updates.description !== null && updates.description !== undefined) body.description = updates.description;
      if (updates.date !== null && updates.date !== undefined) body.date = updates.date;
      if (updates.recurring !== null && updates.recurring !== undefined) body.recurring = updates.recurring;
      if (updates.frequency !== null && updates.frequency !== undefined) body.frequency = updates.frequency;
      if (updates.tags !== null && updates.tags !== undefined) body.tags = updates.tags;

      const updated = await fetchJson<Transaction>(
        `${API_BASE}/api/transactions/${id}`,
        { method: "PUT", body: JSON.stringify(body) }
      );
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    },
    []
  );

  const deleteTransaction = useCallback(async (id: string) => {
    await fetchJson(`${API_BASE}/api/transactions/${id}`, { method: "DELETE" });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        summary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
