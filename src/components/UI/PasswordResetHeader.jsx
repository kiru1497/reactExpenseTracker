import { Wallet, ShieldCheck } from "lucide-react";

export default function PasswordResetHeader({ title, description }) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
        <Wallet size={30} />
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
        Expense Tracker
      </p>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={14} />
        Secure account recovery
      </div>
    </div>
  );
}
