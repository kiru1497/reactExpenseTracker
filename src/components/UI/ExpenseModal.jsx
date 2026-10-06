import { useEffect, useState } from "react";
import { X, Wallet, IndianRupee, LoaderCircle } from "lucide-react";

const categories = [
  "Food",
  "Groceries",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Subscriptions",
  "Other",
];

const initialForm = {
  amount: "",
  description: "",
  category: "Food",
};

export default function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  expense = null,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(expense);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      expense
        ? {
            amount: String(expense.amount),
            description: expense.description,
            category: expense.category,
          }
        : initialForm,
    );

    setError("");
  }, [isOpen, expense]);

  if (!isOpen) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const amount = Number(form.amount);
    const description = form.description.trim();

    // Custom validation is deliberately used instead of the
    // browser's native min validation so the user gets our
    // application-specific error message.
    if (!form.amount || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    if (!description) {
      setError("Please enter an expense description.");
      return;
    }

    try {
      setError("");

      await onSubmit({
        amount,
        description,
        category: form.category,
      });
    } catch (err) {
      setError(err?.message || "Failed to save expense. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        className="relative w-full max-w-lg rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="mb-7 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Wallet size={23} />
          </div>

          <div>
            <h2
              id="expense-modal-title"
              className="text-xl font-extrabold text-slate-900"
            >
              {isEditing ? "Edit Expense" : "Add New Expense"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of where your money goes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Amount (₹)
            </label>

            <div className="relative">
              <IndianRupee
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-700"
              />

              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                disabled={loading}
                aria-required="true"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <input
              id="description"
              name="description"
              type="text"
              maxLength={100}
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Monthly grocery shopping"
              disabled={loading}
              aria-required="true"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loading}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#176b45] px-6 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#125638] focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Expense"
              ) : (
                "Add Expense"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
