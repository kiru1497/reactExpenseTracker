import { useState } from "react";
import { Bot, Check, LoaderCircle, Sparkles, X } from "lucide-react";
import { parseExpenseWithAI } from "../../services/openRouter";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const initialExpense = null;

export default function AiExpenseModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [input, setInput] = useState("");
  const [expense, setExpense] = useState(initialExpense);
  const [error, setError] = useState("");
  const [parsing, setParsing] = useState(false);

  if (!isOpen) {
    return null;
  }

  async function handleParse() {
    if (parsing || loading) {
      return;
    }

    setError("");
    setExpense(null);

    if (!input.trim()) {
      setError("Describe your expense first.");
      return;
    }

    try {
      setParsing(true);

      const result = await parseExpenseWithAI(input);

      setExpense(result);
    } catch (err) {
      setError(
        err?.message || "Unable to understand the expense. Please try again.",
      );
    } finally {
      setParsing(false);
    }
  }

  async function handleConfirm() {
    if (!expense || loading) {
      return;
    }

    try {
      setError("");

      await onConfirm(expense);

      setInput("");
      setExpense(null);
    } catch (err) {
      setError(err?.message || "Unable to save the expense. Please try again.");
    }
  }

  function handleClose() {
    if (parsing || loading) {
      return;
    }

    setInput("");
    setExpense(null);
    setError("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !parsing && !loading) {
          handleClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-expense-modal-title"
        className="relative w-full max-w-xl rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={parsing || loading}
          aria-label="Close AI expense modal"
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="mb-7 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Bot size={24} />
          </div>

          <div>
            <h2
              id="ai-expense-modal-title"
              className="text-xl font-extrabold text-slate-900"
            >
              Add Expense with AI
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Describe your expense naturally and AI will fill in the details.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="ai-expense-input"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Describe your expense
            </label>

            <textarea
              id="ai-expense-input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setError("");
                setExpense(null);
              }}
              maxLength={500}
              rows={4}
              disabled={parsing || loading}
              placeholder="e.g. I spent ₹450 at Swiggy for dinner yesterday"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-slate-400">
              {input.length}/500 characters
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {expense && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-800">
                <Sparkles size={16} />
                AI understood this expense as
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold text-slate-400">Amount</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {currency.format(expense.amount)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold text-slate-400">
                    Category
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {expense.category}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-400">
                    Description
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {expense.description}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-400">Date</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {new Date(`${expense.date}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={parsing || loading}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {!expense ? (
              <button
                type="button"
                onClick={handleParse}
                disabled={parsing || loading || !input.trim()}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#176b45] px-6 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {parsing ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Understanding...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Understand Expense
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#176b45] px-6 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    Add Expense
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
