import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";

import AuthLayout from "../components/UI/AuthLayout";
import FormField from "../components/UI/FormField";
import Alert from "../components/UI/Alert";

import { signInWithEmail } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Enter both your email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmail(email.trim(), password);

      login(result);

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout mode="login">
      {location.state?.message && (
        <div className="mb-5">
          <Alert success>{location.state.message}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <FormField
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
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
              Signing in…
            </>
          ) : (
            <>
              Login
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        New user?{" "}
        <Link
          to="/signup"
          className="font-bold text-emerald-700 underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
