import type { Category, TransactionType } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  // Income Categories
  {
    id: "income-salary",
    name: "Salary",
    type: "income",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "income-freelance",
    name: "Freelance",
    type: "income",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "income-investments",
    name: "Investments",
    type: "income",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "income-gifts",
    name: "Gifts",
    type: "income",
    color: "from-emerald-500 to-green-600",
  },
  {
    id: "income-other",
    name: "Other Income",
    type: "income",
    color: "from-emerald-500 to-green-600",
  },

  // Expense Categories
  {
    id: "expense-housing",
    name: "Housing",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-food",
    name: "Food & Dining",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-transport",
    name: "Transportation",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-utilities",
    name: "Utilities",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-entertainment",
    name: "Entertainment",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-healthcare",
    name: "Healthcare",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-shopping",
    name: "Shopping",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-education",
    name: "Education",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "expense-other",
    name: "Other Expenses",
    type: "expense",
    color: "from-red-500 to-rose-600",
  },

  // Asset Categories
  {
    id: "asset-cash",
    name: "Cash",
    type: "asset",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "asset-savings",
    name: "Savings",
    type: "asset",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "asset-investments",
    name: "Investments",
    type: "asset",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "asset-property",
    name: "Property",
    type: "asset",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "asset-vehicles",
    name: "Vehicles",
    type: "asset",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "asset-other",
    name: "Other Assets",
    type: "asset",
    color: "from-blue-500 to-indigo-600",
  },

  // Liability Categories
  {
    id: "liability-credit-card",
    name: "Credit Card",
    type: "liability",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "liability-personal-loan",
    name: "Personal Loan",
    type: "liability",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "liability-mortgage",
    name: "Mortgage",
    type: "liability",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "liability-car-loan",
    name: "Car Loan",
    type: "liability",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "liability-student-loan",
    name: "Student Loan",
    type: "liability",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "liability-other",
    name: "Other Liabilities",
    type: "liability",
    color: "from-amber-500 to-orange-600",
  },
];

export const getCategoriesByType = (
  type: TransactionType,
  categories: Category[]
): Category[] => {
  return categories.filter((cat) => cat.type === type);
};

export const getCategoryById = (
  id: string,
  categories: Category[]
): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};
