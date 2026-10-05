import { useEffect, useState } from "react";
import { LogOut, Wallet } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../features/auth/authSlice";
import { clearExpenses } from "../features/expenses/expensesSlice";

import { getAccountInfo } from "../firebase/firebase";

import ExpenseSidebar from "../components/Expenses/ExpenseSidebar";
import VerifyEmailModal from "../components/UI/VerifyEmailModal";
import Alert from "../components/UI/Alert";

export default function Dashboard() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [emailVerified, setEmailVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState("");
  const [verificationError, setVerificationError] = useState("");

  const returnedFromVerification = searchParams.get("verified") === "1";

  useEffect(() => {
    let active = true;

    async function checkVerification() {
      setChecking(true);
      setVerificationError("");

      try {
        const account = await getAccountInfo(token);

        if (!active) return;

        setEmailVerified(account.emailVerified);

        if (returnedFromVerification && account.emailVerified) {
          setNotice("Email verified");
        } else if (returnedFromVerification && !account.emailVerified) {
          setVerificationError(
            "We couldn't confirm your email yet. Please try opening the verification link again.",
          );
        }
      } catch (err) {
        if (!active) return;

        setVerificationError(
          err.message || "Unable to check your email verification status.",
        );
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    if (token) {
      checkVerification();
    } else {
      setChecking(false);
    }

    return () => {
      active = false;
    };
  }, [token, returnedFromVerification]);

  function handleLogout() {
    dispatch(logout());
    dispatch(clearExpenses());

    navigate("/login", { replace: true });
  }

  const displayName = user?.displayName?.trim() || user?.email || "there";

  return (
    <div className="flex min-h-screen flex-col bg-[#f5faf6] md:flex-row">
      {/* Persistent sidebar */}
      <ExpenseSidebar />

      {/* Dashboard content */}
      <main className="min-w-0 flex-1">
        {/* Top navigation area */}
        <header className="flex h-[88px] items-center border-b border-emerald-100 bg-white px-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Your finances
            </p>
            <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
          {/* Welcome section */}
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e7f5eb] text-[#176b45]">
                <Wallet size={30} />
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-emerald-700">
                Your financial overview
              </p>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#172923] sm:text-4xl">
                Welcome to Expense Tracker
              </h1>

              <p className="mt-4 text-slate-500">
                Hello, {displayName}. Your finance dashboard will live here.
              </p>

              {checking && (
                <p className="mt-5 text-sm text-slate-400">
                  Checking email verification...
                </p>
              )}

              {!checking && notice && (
                <div className="mt-6 text-left">
                  <Alert success>{notice}</Alert>
                </div>
              )}

              {!checking && verificationError && (
                <div className="mt-6 text-left">
                  <Alert>{verificationError}</Alert>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="mx-auto mt-9 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </section>
        </div>
      </main>

      {!checking && !emailVerified && token && (
        <VerifyEmailModal email={user?.email} token={token} />
      )}
    </div>
  );
}
