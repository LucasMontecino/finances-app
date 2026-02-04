import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/finances_app?schema=public";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  { id: "income-salary", name: "Salary", type: "income", color: "from-emerald-500 to-green-600" },
  { id: "income-freelance", name: "Freelance", type: "income", color: "from-emerald-500 to-green-600" },
  { id: "income-investments", name: "Investments", type: "income", color: "from-emerald-500 to-green-600" },
  { id: "income-gifts", name: "Gifts", type: "income", color: "from-emerald-500 to-green-600" },
  { id: "income-other", name: "Other Income", type: "income", color: "from-emerald-500 to-green-600" },
  { id: "expense-housing", name: "Housing", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-food", name: "Food & Dining", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-transport", name: "Transportation", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-utilities", name: "Utilities", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-entertainment", name: "Entertainment", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-healthcare", name: "Healthcare", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-shopping", name: "Shopping", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-education", name: "Education", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "expense-other", name: "Other Expenses", type: "expense", color: "from-red-500 to-rose-600" },
  { id: "asset-cash", name: "Cash", type: "asset", color: "from-blue-500 to-indigo-600" },
  { id: "asset-savings", name: "Savings", type: "asset", color: "from-blue-500 to-indigo-600" },
  { id: "asset-investments", name: "Investments", type: "asset", color: "from-blue-500 to-indigo-600" },
  { id: "asset-property", name: "Property", type: "asset", color: "from-blue-500 to-indigo-600" },
  { id: "asset-vehicles", name: "Vehicles", type: "asset", color: "from-blue-500 to-indigo-600" },
  { id: "asset-other", name: "Other Assets", type: "asset", color: "from-blue-500 to-indigo-600" },
  { id: "liability-credit-card", name: "Credit Card", type: "liability", color: "from-amber-500 to-orange-600" },
  { id: "liability-personal-loan", name: "Personal Loan", type: "liability", color: "from-amber-500 to-orange-600" },
  { id: "liability-mortgage", name: "Mortgage", type: "liability", color: "from-amber-500 to-orange-600" },
  { id: "liability-car-loan", name: "Car Loan", type: "liability", color: "from-amber-500 to-orange-600" },
  { id: "liability-student-loan", name: "Student Loan", type: "liability", color: "from-amber-500 to-orange-600" },
  { id: "liability-other", name: "Other Liabilities", type: "liability", color: "from-amber-500 to-orange-600" },
];

async function main() {
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      create: cat,
      update: { name: cat.name, type: cat.type, color: cat.color },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
