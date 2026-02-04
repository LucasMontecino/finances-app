import type { FinanceData } from "@/types";

export default function Card({ card }: { card: FinanceData }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div
        className={`mb-3 inline-block rounded-lg bg-gradient-to-r ${card.color} px-3 py-1 text-sm font-medium text-white`}
      >
        {card.title}
      </div>
      <p className="text-slate-600 dark:text-slate-300">{card.description}</p>
    </div>
  );
}
