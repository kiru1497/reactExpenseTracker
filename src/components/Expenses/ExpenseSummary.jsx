import { ArrowDownRight, ReceiptText } from "lucide-react";

export default function ExpenseSummary({ total, count }) {
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(total);

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            Total recorded expenses
          </p>
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
            <ArrowDownRight size={19} />
          </div>
        </div>
        <p className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
          {formattedTotal}
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            Number of transactions
          </p>
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
            <ReceiptText size={19} />
          </div>
        </div>
        <p className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
          {count}
        </p>
      </div>
    </section>
  );
}
