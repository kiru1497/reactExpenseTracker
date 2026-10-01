import { useEffect, useState } from "react";

import { LogOut, Wallet } from "lucide-react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { getAccountInfo } from "../firebase/firebase";

import VerifyEmailModal from "../components/UI/VerifyEmailModal";
import Alert from "../components/UI/Alert";

export default function Home() {
  const { user, token, logout } = useAuth();

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
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  const displayName = user?.displayName?.trim() || user?.email || "there";

  return (
    <>
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
            onClick={handleLogout}
            className="mx-auto mt-9 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut size={16} />
            Log out
          </button>
        </section>
      </main>

      {!checking && !emailVerified && token && (
        <VerifyEmailModal email={user?.email} token={token} />
      )}
    </>
  );
}
