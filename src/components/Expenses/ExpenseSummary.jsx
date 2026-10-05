import { ArrowDownRight, ReceiptText, Sparkles } from "lucide-react";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function ExpenseSummary({ total, count, showPremium }) {
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
          {currency.format(total)}
        </p>

        {showPremium && (
          <button
            type="button"
            onClick={() => {
              // Replace with your actual premium activation flow.
              window.alert("Premium activation will be available soon.");
            }}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#176b45] px-4 text-sm font-bold text-white transition hover:bg-[#125638]"
          >
            <Sparkles size={16} />
            Activate Premium
          </button>
        )}
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
