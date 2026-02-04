"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DataPoint {
  name: string;
  value: number;
  categoryId: string;
}

interface ExpenseByCategoryChartProps {
  data: DataPoint[];
}

const CHART_COLORS = [
  "#f43f5e",
  "#fb923c",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#d946ef",
];

export default function ExpenseByCategoryChart({
  data,
}: ExpenseByCategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-slate-500 dark:text-slate-400">
        No expense data for this period
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
