import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Alert({ children, success = false }) {
  if (!children) return null;

  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-2 rounded-xl border px-3.5 py-3 text-sm ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      <Icon size={17} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
