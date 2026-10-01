import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Mail,
  MailCheck,
} from "lucide-react";

import AuthLayout from "../components/UI/AuthLayout";
import FormField from "../components/UI/FormField";
import Alert from "../components/UI/Alert";
import PasswordResetHeader from "../components/UI/PasswordResetHeader";

import { sendPasswordResetEmail } from "../firebase/firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(normalizedEmail);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unable to send the reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout mode="login">
      <div className="mx-auto w-full max-w-md">
        <PasswordResetHeader
          title={success ? "Check your inbox" : "Forgot password?"}
          description={
            success
              ? "If an account is registered with this address, you should receive a password reset email shortly."
              : "Enter the email address you used to register. We'll send you a secure link to reset your password."
          }
        />

        {success ? (
          <div className="mt-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <MailCheck size={26} />
            </div>

            <p className="mt-5 break-all text-sm font-semibold text-slate-700">
              {email.trim()}
            </p>

            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-left text-sm leading-6 text-emerald-900">
              Check your inbox and spam folder for the reset link. The link may
              expire, so complete the reset promptly.
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="mt-6 text-sm font-semibold text-emerald-700 hover:underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <Alert>{error}</Alert>}

            <FormField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b45] px-4 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(23,107,69,.8)] transition hover:bg-[#125638] focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  <Mail size={17} />
                  Send Link
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
