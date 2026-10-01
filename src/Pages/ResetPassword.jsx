import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import AuthLayout from "../components/UI/AuthLayout";
import Alert from "../components/UI/Alert";
import PasswordResetHeader from "../components/UI/PasswordResetHeader";

import { confirmPasswordReset } from "../firebase/firebase";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validLink = mode === "resetPassword" && Boolean(oobCode);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!validLink) {
      setError(
        "This reset link is invalid. Request a new password reset email.",
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(oobCode, password);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout mode="login">
      <div className="mx-auto w-full max-w-md">
        <PasswordResetHeader
          title={success ? "Password updated" : "Create new password"}
          description={
            success
              ? "Your password has been successfully changed. You can now log in using your new password."
              : "Choose a new password to securely regain access to your Expense Tracker account."
          }
        />

        {success ? (
          <div className="mt-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={32} />
            </div>

            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              Password reset successful.
            </div>

            <Link
              to="/login"
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b45] px-4 text-sm font-bold text-white transition hover:bg-[#125638]"
            >
              Go to login
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : !validLink ? (
          <div className="mt-8 space-y-5">
            <Alert>
              This password reset link is invalid or incomplete. Please request
              a new one.
            </Alert>

            <Link
              to="/forgot-password"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#176b45] text-sm font-bold text-white transition hover:bg-[#125638]"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <Alert>{error}</Alert>}

            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm new password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
                />

                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <p className="text-xs leading-5 text-slate-400">
              Use at least 6 characters. Choose a unique password that you don't
              use on other websites.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b45] px-4 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(23,107,69,.8)] transition hover:bg-[#125638] focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Updating password...
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
