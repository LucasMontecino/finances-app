import type { FinanceData } from "@/types";
import Card from "../singles/Card";

export default function Cards({ data }: { data: FinanceData[] }) {
  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((card) => (
        <Card card={card} key={card.title} />
      ))}
    </div>
  );
}
