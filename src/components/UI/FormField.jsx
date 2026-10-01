import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FormField({ label, type = "text", ...props }) {
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <span className="relative block">
        <input
          type={isPassword ? (visible ? "text" : "password") : type}
          className="h-12 w-full rounded-xl border border-slate-200 bg-[#fbfcfb] px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10"
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </span>
    </label>
  );
}
