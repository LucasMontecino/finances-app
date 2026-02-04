import type { Transaction, Category } from "@/types";
import type { Transaction as PrismaTransaction, Category as PrismaCategory } from "@prisma/client";

export function mapPrismaTransactionToTransaction(
  t: PrismaTransaction & { category: PrismaCategory }
): Transaction {
  return {
    id: t.id,
    type: t.type as Transaction["type"],
    category: t.categoryId,
    amount: Number(t.amount),
    description: t.description,
    date: t.date.toISOString(),
    recurring: t.recurring,
    frequency: t.frequency as Transaction["frequency"],
    tags: t.tags ?? [],
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export function mapPrismaCategoryToCategory(c: PrismaCategory): Category {
  return {
    id: c.id,
    name: c.name,
    type: c.type as Category["type"],
    color: c.color,
    icon: c.icon ?? undefined,
  };
}
