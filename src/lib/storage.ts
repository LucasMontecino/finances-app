import type { Transaction, Category } from "@/types";

const STORAGE_KEYS = {
  TRANSACTIONS: "finances-app-transactions",
  CATEGORIES: "finances-app-categories",
} as const;

// Transaction Storage
export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading transactions from localStorage:", error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(transactions)
    );
  } catch (error) {
    console.error("Error saving transactions to localStorage:", error);
  }
};

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const updateTransaction = (
  id: string,
  updates: Partial<Transaction>
): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveTransactions(transactions);
  }
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  saveTransactions(filtered);
};

// Category Storage
export const getCategories = (): Category[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading categories from localStorage:", error);
    return [];
  }
};

export const saveCategories = (categories: Category[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories to localStorage:", error);
  }
};

// Export/Import
export const exportData = (): string => {
  const transactions = getTransactions();
  const categories = getCategories();
  return JSON.stringify({ transactions, categories }, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.transactions) saveTransactions(data.transactions);
    if (data.categories) saveCategories(data.categories);
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

export const clearAllData = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
};
