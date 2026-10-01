import { LogOut, Wallet } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  const name = user?.displayName?.trim() || user?.email || "there";

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center p-5">
      <section className="w-full max-w-xl rounded-[2rem] border border-white bg-white p-8 text-center shadow-[0_24px_90px_-42px_rgba(20,55,39,.25)] sm:p-14">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e7f5eb] text-[#176b45]">
          <Wallet size={30} />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-emerald-700">
          You're signed in
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#172923] sm:text-4xl">
          Welcome to Expense Tracker
        </h1>

        <p className="mt-4 text-slate-500">
          Hello, {name}. Your finance dashboard will live here.
        </p>

        <button
          onClick={handleLogout}
          className="mx-auto mt-9 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <LogOut size={16} />
          Log out
        </button>
      </section>
    </main>
  );
}
