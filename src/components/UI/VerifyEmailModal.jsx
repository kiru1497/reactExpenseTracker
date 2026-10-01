import { useState } from "react";

import { MailCheck, ShieldCheck, ArrowRight, LoaderCircle } from "lucide-react";

import Alert from "./Alert";

import { sendVerificationEmail } from "../../firebase/firebase";

export default function VerifyEmailModal({ email, token }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleVerification() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await sendVerificationEmail(token);

      setSuccess(
        `Verification email sent to ${result.email}. Please check your inbox.`,
      );
    } catch (err) {
      setError(err.message || "Unable to send verification email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-title"
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white bg-white p-7 shadow-2xl sm:p-9"
      >
        {/* Decorative top accent */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-400 to-lime-300" />

        {/* Icon */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <MailCheck size={30} />
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-700">
            One quick step
          </p>

          <h2
            id="verification-title"
            className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900"
          >
            Verify email address
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Confirm your email address to keep your Moneta account up to date.
          </p>
        </div>

        {/* Email display */}
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 shadow-sm">
            <MailCheck size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-400">
              Verification email will be sent to
            </p>

            <p className="truncate text-sm font-semibold text-slate-700">
              {email}
            </p>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-5 space-y-3">
          {error && <Alert>{error}</Alert>}

          {success && <Alert success>{success}</Alert>}
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={handleVerification}
          disabled={loading}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b45] px-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#125638] focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Sending email...
            </>
          ) : (
            <>
              Verify email
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={15} />
          Secure verification powered by Firebase
        </div>
      </div>
    </div>
  );
}
