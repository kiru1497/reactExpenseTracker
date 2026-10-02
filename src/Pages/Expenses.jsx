import { useEffect, useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";

import ExpenseSidebar from "../components/Expenses/ExpenseSidebar";
import ExpenseTopbar from "../components/Expenses/ExpenseTopbar";
import ExpenseSummary from "../components/Expenses/ExpenseSummary";
import ExpenseTable from "../components/Expenses/ExpenseTable";
import ExpenseModal from "../components/UI/ExpenseModal";

import { useAuth } from "../context/AuthContext";

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../firebase/firebase";

export default function Expenses() {
  const { user, token } = useAuth();

  // Firebase Authentication returns localId for the user's UID.
  const uid = user?.uid || user?.localId;

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // Fetch expenses from Firebase when the page loads
  useEffect(() => {
    let active = true;

    async function loadExpenses() {
      setLoading(true);
      setError("");

      try {
        const data = await getExpenses(uid, token);

        if (active) {
          setExpenses(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load your expenses.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (uid && token) {
      loadExpenses();
    } else {
      setLoading(false);
      setError("Please log in to view your expenses.");
    }

    return () => {
      active = false;
    };
  }, [uid, token]);

  // Search and sort
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

  // Summary
  const total = useMemo(
    () =>
      expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
    [expenses],
  );

  // Modal
  function openAddModal() {
    setError("");
    setEditingExpense(null);
    setModalOpen(true);
  }

  function openEditModal(expense) {
    setError("");
    setEditingExpense(expense);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingExpense(null);
  }

  // Add or edit
  async function handleSaveExpense(data) {
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      if (editingExpense) {
        const updatedData = {
          amount: Number(data.amount),
          description: data.description.trim(),
          category: data.category,
          date: editingExpense.date,
        };

        const updatedExpense = await updateExpense(
          uid,
          token,
          editingExpense.id,
          updatedData,
        );

        setExpenses((prev) =>
          prev.map((expense) =>
            expense.id === editingExpense.id ? updatedExpense : expense,
          ),
        );
      } else {
        const newExpenseData = {
          amount: Number(data.amount),
          description: data.description.trim(),
          category: data.category,
          date: new Date().toISOString(),
        };

        const newExpense = await addExpense(uid, token, newExpenseData);

        setExpenses((prev) => [newExpense, ...prev]);
      }

      setModalOpen(false);
      setEditingExpense(null);
    } catch (err) {
      setError(err.message || "Unable to save the expense.");
    } finally {
      setSaving(false);
    }
  }

  // Delete
  async function handleDeleteExpense(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed || deletingId) return;

    setDeletingId(id);
    setError("");

    try {
      await deleteExpense(uid, token, id);

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete the expense.");
    } finally {
      setDeletingId(null);
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
              <ExpenseSummary total={total} count={expenses.length} />

              <ExpenseTable
                expenses={filteredExpenses}
                onEdit={openEditModal}
                onDelete={handleDeleteExpense}
                deletingId={deletingId}
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
    </div>
  );
}
