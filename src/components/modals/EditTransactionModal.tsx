"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { Transaction } from "@/types";
import { useFinance } from "@/context/FinanceContext";
import { parseAmount } from "@/lib/utils";
import { getCategoriesByType } from "@/lib/categories";

const transactionSchema = z.object({
  type: z.enum(["income", "expense", "asset", "liability"]),
  category: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  recurring: z.boolean(),
  frequency: z
    .enum(["daily", "weekly", "monthly", "yearly"])
    .nullable()
    .optional(),
  tags: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function EditTransactionModal({
  transaction,
  onClose,
}: EditTransactionModalProps) {
  const { updateTransaction, categories } = useFinance();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date.split("T")[0],
      recurring: transaction.recurring,
      frequency: transaction.frequency,
      tags: transaction.tags.join(", "),
    },
  });

  const selectedType = watch("type");
  const isRecurring = watch("recurring");
  const availableCategories = getCategoriesByType(selectedType, categories);

  // Update category when type changes
  useEffect(() => {
    const currentCategory = availableCategories.find(
      (cat) => cat.id === transaction.category
    );
    if (!currentCategory) {
      setValue("category", "");
    }
  }, [selectedType, availableCategories, transaction.category, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    const amount = parseAmount(data.amount);
    const tags = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    try {
      await updateTransaction(transaction.id, {
        type: data.type,
        category: data.category,
        amount,
        description: data.description,
        date: new Date(data.date).toISOString(),
        recurring: data.recurring,
        frequency: data.recurring ? data.frequency || null : null,
        tags,
      });
      toast.success("Transaction updated");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update transaction");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-slate-800">
          <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Edit Transaction
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Transaction Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(["income", "expense", "asset", "liability"] as const).map(
                  (type) => (
                    <label
                      key={type}
                      className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                        selectedType === type
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                      } `}
                    >
                      <input
                        type="radio"
                        value={type}
                        {...register("type")}
                        className="sr-only"
                      />
                      <span className="flex flex-1 flex-col">
                        <span className="block text-sm font-medium capitalize text-slate-900 dark:text-white">
                          {type}
                        </span>
                      </span>
                    </label>
                  )
                )}
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Category
              </label>
              <select
                id="category"
                {...register("category")}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  min="0"
                  {...register("amount")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  {...register("date")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register("description")}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Enter transaction details..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Recurring */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  {...register("recurring")}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="recurring"
                  className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Recurring transaction
                </label>
              </div>

              {isRecurring && (
                <div>
                  <label
                    htmlFor="frequency"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    {...register("frequency")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                {...register("tags")}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="work, personal, urgent"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
