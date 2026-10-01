import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";

import AuthLayout from "../components/UI/AuthLayout";
import FormField from "../components/UI/FormField";
import Alert from "../components/UI/Alert";

import { signUpWithEmail } from "../firebase/firebase";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(form.email.trim(), form.password);

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please log in.",
        },
      });
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout mode="signup">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="First name"
            name="firstName"
            placeholder="First name"
            autoComplete="given-name"
            value={form.firstName}
            onChange={update}
            required
          />

          <FormField
            label="Last name"
            name="lastName"
            placeholder="Last name"
            autoComplete="family-name"
            value={form.lastName}
            onChange={update}
            required
          />
        </div>

        <FormField
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={update}
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={form.password}
          onChange={update}
          required
        />

        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update}
          required
        />

        <Alert>{error}</Alert>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#176b45] px-4 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(23,107,69,.8)] transition hover:bg-[#125638] focus:outline-none focus:ring-4 focus:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {loading ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Sign up
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already a user?{" "}
        <Link
          to="/login"
          className="font-bold text-emerald-700 underline-offset-4 hover:underline"
        >
          Login now
        </Link>
      </p>
    </AuthLayout>
  );
}
