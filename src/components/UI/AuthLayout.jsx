import { ArrowUpRight, ShieldCheck, Wallet } from "lucide-react";

export default function AuthLayout({ children, mode = "login" }) {
  return (
    <main className="auth-shell min-h-screen px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_90px_-42px_rgba(20,55,39,.25)] lg:min-h-[650px] lg:grid-cols-[1.03fr_.97fr]">
          {/* Branding panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#102c22] p-12 text-white lg:flex">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />

            <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/10" />

            <div className="relative z-10 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#b8e6c8] text-[#102c22]">
                <Wallet size={22} />
              </span>

              <span className="font-[Manrope] text-xl font-extrabold tracking-tight">
                moneta<span className="text-[#b8e6c8]">.</span>
              </span>
            </div>

            <div className="relative z-10 max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#c9dfd1]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9ce1b4]" />
                Your money, in perspective
              </div>

              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                Make room for{" "}
                <span className="text-[#a9dfb9]">what matters.</span>
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#b5c8bd]">
                A calmer way to understand your spending, build better habits,
                and stay on top of your finances.
              </p>

              {/* Decorative spending preview */}
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur">
                <div className="flex items-center justify-between text-xs text-[#c2d2c8]">
                  <span>Spending overview</span>
                  <span>
                    This month <ArrowUpRight size={13} className="inline" />
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-[#9eb5a7]">Total expenses</p>
                    <p className="mt-1 font-[Manrope] text-3xl font-bold">
                      ₹24,580
                    </p>
                  </div>

                  <span className="rounded-lg bg-[#b8e6c8]/10 px-2.5 py-1.5 text-xs font-semibold text-[#b8e6c8]">
                    Demo preview
                  </span>
                </div>

                <div className="mt-5 flex h-14 items-end gap-2">
                  {[34, 52, 42, 76, 58, 88, 63, 48, 72, 94, 60, 78].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-[#9bd5ae]"
                        style={{
                          height: `${height}%`,
                          opacity: 0.35 + index * 0.05,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-xs text-[#9eb5a7]">
              <ShieldCheck size={15} />
              Your account is protected with Firebase Authentication
            </div>
          </div>

          {/* Form panel */}
          <div className="flex items-center justify-center px-5 py-12 sm:px-12 lg:px-14">
            <div className="w-full max-w-md">
              <div className="mb-9 flex items-center gap-2 lg:hidden">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#102c22] text-[#b8e6c8]">
                  <Wallet size={20} />
                </span>

                <span className="font-[Manrope] text-xl font-extrabold">
                  moneta<span className="text-emerald-600">.</span>
                </span>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-700">
                  {mode === "login" ? "Welcome back" : "Get started"}
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-[#172923]">
                  {mode === "login"
                    ? "Sign in to Moneta"
                    : "Create your account"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {mode === "login"
                    ? "Pick up where you left off with your finances."
                    : "A few details and you're ready to go."}
                </p>
              </div>

              {children}

              <p className="mt-8 text-center text-xs text-slate-400">
                By continuing, you agree to use Moneta responsibly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
