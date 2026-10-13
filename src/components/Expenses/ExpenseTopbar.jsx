import { Plus, Search, Sparkles } from "lucide-react";

export default function ExpenseTopbar({
  search,
  setSearch,
  onAddExpense,
  onAddExpenseWithAI,
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-emerald-100 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="relative w-full max-w-md">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search expenses..."
          aria-label="Search expenses"
          className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAddExpenseWithAI}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          <Sparkles size={17} />
          Add Expense with AI
        </button>

        <button
          type="button"
          onClick={onAddExpense}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#176b45] px-6 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#125638] hover:shadow-xl"
        >
          <Plus size={19} strokeWidth={2.5} />
          Add Expense
        </button>
      </div>
    </header>
  );
}
