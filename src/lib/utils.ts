import type { Transaction, FinancialSummary } from "@/types";

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Calculate financial summary
export const calculateSummary = (
  transactions: Transaction[]
): FinancialSummary => {
  const summary: FinancialSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    currentBalance: 0,
    netWorth: 0,
  };

  transactions.forEach((transaction) => {
    switch (transaction.type) {
      case "income":
        summary.totalIncome += transaction.amount;
        break;
      case "expense":
        summary.totalExpenses += transaction.amount;
        break;
      case "asset":
        summary.totalAssets += transaction.amount;
        break;
      case "liability":
        summary.totalLiabilities += transaction.amount;
        break;
    }
  });

  summary.currentBalance = summary.totalIncome - summary.totalExpenses;
  summary.netWorth = summary.totalAssets - summary.totalLiabilities;

  return summary;
};

// Filter transactions
export const filterTransactions = (
  transactions: Transaction[],
  filters: {
    type?: string;
    category?: string;
    dateFrom?: string | null;
    dateTo?: string | null;
    search?: string;
  }
): Transaction[] => {
  return transactions.filter((transaction) => {
    // Type filter
    if (
      filters.type &&
      filters.type !== "all" &&
      transaction.type !== filters.type
    ) {
      return false;
    }

    // Category filter
    if (
      filters.category &&
      filters.category !== "all" &&
      transaction.category !== filters.category
    ) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const transactionDate = new Date(transaction.date);
      const fromDate = new Date(filters.dateFrom);
      if (transactionDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const transactionDate = new Date(transaction.date);
      const toDate = new Date(filters.dateTo);
      if (transactionDate > toDate) return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesDescription = transaction.description
        .toLowerCase()
        .includes(searchLower);
      const matchesTags = transaction.tags.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );
      if (!matchesDescription && !matchesTags) return false;
    }

    return true;
  });
};

// Sort transactions
export const sortTransactions = (
  transactions: Transaction[],
  sortBy: "date" | "amount" = "date",
  order: "asc" | "desc" = "desc"
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "amount") {
      comparison = a.amount - b.amount;
    }

    return order === "asc" ? comparison : -comparison;
  });
};

// Validate transaction amount
export const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// Parse amount string to number
export const parseAmount = (amount: string): number => {
  return parseFloat(amount) || 0;
};

// Get start/end of month in ISO date strings (YYYY-MM-DD)
export function getMonthRange(year: number, month: number): {
  start: string;
  end: string;
} {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

// Get start/end of year
export function getYearRange(year: number): { start: string; end: string } {
  return {
    start: `${year}-01-01`,
    end: `${year}-12-31`,
  };
}

// Filter transactions by date range (inclusive)
export function filterByDateRange(
  transactions: Transaction[],
  dateFrom: string,
  dateTo: string
): Transaction[] {
  const from = new Date(dateFrom).getTime();
  const to = new Date(dateTo).getTime();
  return transactions.filter((t) => {
    const tDate = new Date(t.date).getTime();
    return tDate >= from && tDate <= to;
  });
}

// Get expense total by category for charts (categoryId -> total)
export function getExpensesByCategory(
  transactions: Transaction[],
  categoryNames: Record<string, string>
): { name: string; value: number; categoryId: string }[] {
  const byCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
    });
  return Object.entries(byCategory).map(([categoryId, value]) => ({
    name: categoryNames[categoryId] ?? categoryId,
    value: Math.round(value * 100) / 100,
    categoryId,
  }));
}

// Get income/expense totals by month for trend (last N months)
export function getMonthlyTrend(
  transactions: Transaction[],
  monthsCount: number
): { month: string; income: number; expenses: number }[] {
  const result: { month: string; income: number; expenses: number }[] = [];
  const now = new Date();
  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const { start, end } = getMonthRange(d.getFullYear(), d.getMonth() + 1);
    const filtered = filterByDateRange(transactions, start, end);
    const income = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expenses = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    result.push({
      month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      income,
      expenses,
    });
  }
  return result;
}
