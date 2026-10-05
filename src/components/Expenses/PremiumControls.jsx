import { Download, Moon, Sun } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { toggleTheme } from "../../features/theme/themeSlice";

import { exportExpensesToCsv } from "../../utils/exportExpensesToCsv";

export default function PremiumControls({ expenses }) {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.mode);

  function handleDownload() {
    exportExpensesToCsv(expenses);
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-bold text-slate-900">Premium Features</p>

        <p className="mt-1 text-sm text-slate-500">
          Customize your experience and export your financial data.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => dispatch(toggleTheme())}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}

          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!expenses.length}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#176b45] px-4 text-sm font-bold text-white transition hover:bg-[#125638] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={17} />
          Download CSV
        </button>
      </div>
    </section>
  );
}
