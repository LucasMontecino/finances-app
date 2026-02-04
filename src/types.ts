// UI Types
export interface FinanceData {
  title: string;
  description: string;
  color: string;
}

// Transaction Types
export type TransactionType = "income" | "expense" | "asset" | "liability";

export type RecurringFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | null;

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string; // ISO string format
  recurring: boolean;
  frequency: RecurringFrequency;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  type: TransactionType;
  category: string;
  amount: string;
  description: string;
  date: string;
  recurring: boolean;
  frequency: RecurringFrequency;
  tags: string[];
}

// Category Types
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

// Filter Types
export interface TransactionFilters {
  type: TransactionType | "all";
  category: string | "all";
  dateFrom: string | null;
  dateTo: string | null;
  search: string;
}

// Summary Types
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  currentBalance: number;
  netWorth: number;
}
