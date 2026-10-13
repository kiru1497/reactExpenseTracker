import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Wallet, LayoutDashboard, ReceiptText, LogOut } from "lucide-react";

import { logout } from "../../features/auth/authSlice";
import { clearExpenses } from "../../features/expenses/expensesSlice";
import { resetPremium } from "../../features/premium/premiumSlice";

const navigation = [
  {
    label: "Dashboard",
    path: "/home",
    icon: LayoutDashboard,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: ReceiptText,
  },
];

export default function ExpenseSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    dispatch(clearExpenses());
    dispatch(resetPremium());

    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex w-full flex-col border-b border-emerald-100 bg-white px-4 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-7">
      {/* Moneta Logo */}
      <div className="mb-5 flex items-center gap-3 px-2 md:mb-12">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#176b45] text-white shadow-md shadow-emerald-900/10">
          <Wallet size={22} />
        </div>

        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          Moneta
        </span>
      </div>

      <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#176b45] text-white shadow-lg shadow-emerald-900/10"
                  : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-800"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 md:mt-auto md:border-t md:border-slate-100 md:pt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
