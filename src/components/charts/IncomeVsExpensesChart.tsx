"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeVsExpensesChartProps {
  data: DataPoint[];
}

export default function IncomeVsExpensesChart({ data }: IncomeVsExpensesChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-slate-200 dark:stroke-slate-600"
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-slate-600 dark:text-slate-400"
          />
          <YAxis
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-slate-600 dark:text-slate-400"
            tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tw-bg-opacity, 1)",
              border: "1px solid rgb(226 232 240)",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => [formatCurrency(value), ""]}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
