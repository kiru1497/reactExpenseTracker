import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";

import ExpenseSidebar from "../components/Expenses/ExpenseSidebar";
import ExpenseTopbar from "../components/Expenses/ExpenseTopbar";
import ExpenseSummary from "../components/Expenses/ExpenseSummary";
import ExpenseTable from "../components/Expenses/ExpenseTable";
import ExpenseModal from "../components/UI/ExpenseModal";
import AiExpenseModal from "../components/UI/AiExpenseModal";
import PremiumControls from "../components/Expenses/PremiumControls";

import {
  fetchExpenses,
  createExpense,
  editExpense,
  removeExpense,
  clearExpenseError,
} from "../features/expenses/expensesSlice";

import {
  selectExpenses,
  selectExpenseTotal,
  selectExpenseCount,
  selectShouldShowPremium,
} from "../features/expenses/expensesSelectors";

export default function Expenses() {
  const dispatch = useDispatch();

  const expenses = useSelector(selectExpenses);
  const total = useSelector(selectExpenseTotal);
  const count = useSelector(selectExpenseCount);
  const showPremium = useSelector(selectShouldShowPremium);

  const premiumActivated = useSelector((state) => state.premium.activated);

  const loading = useSelector((state) => state.expenses.loading);

  const saving = useSelector((state) => state.expenses.saving);

  const deletingIds = useSelector((state) => state.expenses.deletingIds);

  const error = useSelector((state) => state.expenses.error);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return expenses
      .filter((expense) => {
        return (
          expense.description?.toLowerCase().includes(query) ||
          expense.category?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, search]);

  function openAddModal() {
    dispatch(clearExpenseError());

    setEditingExpense(null);
    setModalOpen(true);
  }

  function openAiModal() {
    dispatch(clearExpenseError());

    setAiModalOpen(true);
  }

  function openEditModal(expense) {
    dispatch(clearExpenseError());

    setEditingExpense(expense);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingExpense(null);
  }

  function closeAiModal() {
    if (saving) {
      return;
    }

    setAiModalOpen(false);
  }

  async function handleSaveExpense(data) {
    const expenseData = {
      amount: Number(data.amount),
      description: data.description.trim(),
      category: data.category,
    };

    try {
      if (editingExpense) {
        await dispatch(
          editExpense({
            id: editingExpense.id,
            expense: {
              ...expenseData,
              date: editingExpense.date,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          createExpense({
            ...expenseData,
            date: new Date().toISOString(),
          }),
        ).unwrap();
      }

      setModalOpen(false);
      setEditingExpense(null);
    } catch (err) {
      throw new Error(
        typeof err === "string" ? err : "Unable to save expense.",
      );
    }
  }

  async function handleSaveAiExpense(expense) {
    try {
      await dispatch(
        createExpense({
          amount: Number(expense.amount),
          description: expense.description.trim(),
          category: expense.category,
          date: new Date(`${expense.date}T00:00:00`).toISOString(),
        }),
      ).unwrap();

      setAiModalOpen(false);
    } catch (err) {
      throw new Error(
        typeof err === "string" ? err : "Unable to save AI-generated expense.",
      );
    }
  }

  async function handleDeleteExpense(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed || deletingIds.length > 0) {
      return;
    }

    try {
      await dispatch(removeExpense(id)).unwrap();
    } catch {
      // Redux stores the API error for display.
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5faf6] md:flex-row">
      <ExpenseSidebar />

      <main className="min-w-0 flex-1">
        <ExpenseTopbar
          search={search}
          setSearch={setSearch}
          onAddExpense={openAddModal}
          onAddExpenseWithAI={openAiModal}
        />

        <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Your finances
            </p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Expenses
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track your spending and keep your finances organized.
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

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-emerald-700">
              <LoaderCircle size={24} className="animate-spin" />

              <span className="text-sm font-medium">
                Loading your expenses...
              </span>
            </div>
          ) : (
            <>
              <ExpenseSummary
                total={total}
                count={count}
                showPremium={showPremium}
              />

              {premiumActivated && <PremiumControls expenses={expenses} />}

              <ExpenseTable
                expenses={filteredExpenses}
                onEdit={openEditModal}
                onDelete={handleDeleteExpense}
                deletingId={deletingIds}
              />
            </>
          )}
        </div>
      </main>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSaveExpense}
        expense={editingExpense}
        loading={saving}
      />

      <AiExpenseModal
        isOpen={aiModalOpen}
        onClose={closeAiModal}
        onConfirm={handleSaveAiExpense}
        loading={saving}
      />
    </div>
  );
}
