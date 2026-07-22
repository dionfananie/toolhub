import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roman to Decimal — Toolhub" },
    {
      name: "description",
      content:
        "Convert Roman numerals to decimal numbers instantly. Supports I, V, X, L, C, D, M and standard subtractive notation.",
    },
  ];
}

export default function RomanToDecimal() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto animate-fade-in pt-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate("/convert")}
        className="self-start inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Converters
      </button>

      {/* Header */}
      <section className="flex flex-col gap-2">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            backgroundColor: "color-mix(in srgb, var(--tk-tertiary) 10%, transparent)",
            color: "var(--tk-tertiary)",
          }}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <text x="12" y="16" textAnchor="middle" className="font-display font-bold" fontSize="14" fill="currentColor">
              VII
            </text>
          </svg>
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          Roman to Decimal
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Convert Roman numerals to numbers instantly.
        </p>
      </section>

      {/* Input */}
      <div className="flex flex-col gap-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Roman Numeral
        </label>
        <input
          type="text"
          placeholder="e.g. MCMXCIV"
          className="w-full rounded-[48px] px-6 py-4 text-2xl font-display outline-none transition-colors focus:border-primary/40"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            color: "var(--tk-on-surface)",
          }}
          aria-label="Enter Roman numeral"
        />
      </div>

      {/* Result */}
      <div
        className="relative rounded-xl p-6 overflow-hidden"
        style={{
          backgroundColor: "var(--tk-surface-container-lowest)",
          border: "1px solid color-mix(in srgb, var(--tk-primary) 10%, transparent)",
        }}
      >
        <span
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--tk-primary) 5%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Result
          </span>
          <span className="text-5xl sm:text-6xl font-bold font-display text-primary tracking-tighter">
            1994
          </span>
        </div>
      </div>

      {/* Convert button */}
      <button
        type="button"
        className="w-full py-4 rounded-full font-semibold text-sm cursor-pointer transition-all hover:brightness-110"
        style={{
          backgroundColor: "var(--tk-surface-container-highest)",
          color: "var(--tk-on-surface)",
        }}
      >
        Convert
      </button>

      {/* Reference table */}
      <div className="p-4 rounded-card tonal-container text-sm">
        <p className="font-semibold text-on-surface mb-3">Roman numeral reference</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { r: "I", d: "1" },
            { r: "V", d: "5" },
            { r: "X", d: "10" },
            { r: "L", d: "50" },
            { r: "C", d: "100" },
            { r: "D", d: "500" },
            { r: "M", d: "1000" },
          ].map(({ r, d }) => (
            <div key={r} className="flex items-center gap-3 text-on-surface-variant">
              <span className="font-display font-bold text-on-surface w-4">{r}</span>
              <span>=</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
