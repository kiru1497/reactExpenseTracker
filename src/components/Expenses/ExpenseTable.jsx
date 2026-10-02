import { Pencil, Trash2, ReceiptText } from "lucide-react";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Transaction History
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage your expenses.
          </p>
        </div>
        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          {expenses.length} records
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ReceiptText size={26} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">
            No expenses found
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Your transactions will appear here after you add an expense.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">Expense</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 text-right font-bold">Amount</th>
                <th className="px-6 py-4 text-center font-bold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="transition hover:bg-emerald-50/40"
                >
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800">
                      {expense.description}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {expense.category}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-5 text-slate-500">
                    {formatDate(expense.date)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-5 text-right font-bold text-rose-600">
                    - {currency.format(expense.amount)}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        aria-label={`Edit ${expense.description}`}
                        title="Edit expense"
                        className="rounded-lg p-2 text-sky-700 transition hover:bg-sky-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(expense.id)}
                        aria-label={`Delete ${expense.description}`}
                        title="Delete expense"
                        className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
