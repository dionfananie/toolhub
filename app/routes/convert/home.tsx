import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Converters — Toolhub" },
    {
      name: "description",
      content:
        "PDF scanning, JSON to CSV conversion, Roman numeral to decimal, unit converters, and more — fast and accurate.",
    },
  ];
}

/* ---------- SVG Icons ---------- */

function ScanIcon() {
  return (
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
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </svg>
  );
}

function JsonIcon() {
  return (
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function RomanIcon() {
  return (
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
      <text
        x="12"
        y="16"
        textAnchor="middle"
        className="font-display font-bold"
        fontSize="14"
        fill="currentColor"
      >
        VII
      </text>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/* ---------- Hero Section Component — PDF Scanner ---------- */

function PdfScannerSection() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden col-span-full rounded-[32px] glass tonal-container">
      {/* Neon background glow */}
      <span
        className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--tk-primary) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-[33px]">
        {/* Left: Text content */}
        <div className="flex flex-col gap-6 w-full lg:w-[413px] shrink-0">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: "color-mix(in srgb, var(--tk-primary) 10%, transparent)",
              color: "var(--tk-primary)",
            }}
          >
            <span className="w-[10px] h-[11px] rounded-full bg-primary/40" />
            Optical Intelligence
          </span>

          {/* Title */}
          <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight leading-tight">
            PDF Scanner
          </h2>

          {/* Description */}
          <p className="text-base text-on-surface-variant leading-relaxed">
            Transform physical documents into high-fidelity searchable PDFs
            using our advanced OCR engine. Simply drag your file into the
            projection area below to begin the analysis.
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => navigate("/convert/pdf-scanner")}
            className="inline-flex items-center gap-2 self-start px-8 py-4 rounded-full neon-gradient text-[#66002c] font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            <ScanIcon />
            Scan Document
          </button>
        </div>

        {/* Right: Drop zone */}
        <div className="flex flex-col items-center justify-center w-full max-w-[417px] h-[320px] rounded-[48px] border-2 border-dashed cursor-pointer hover:border-primary/40 transition-colors"
          style={{
            backgroundColor: "color-mix(in srgb, var(--tk-surface-container-lowest) 50%, transparent)",
            borderColor: "color-mix(in srgb, var(--tk-outline-variant) 30%, transparent)",
          }}
          onClick={() => navigate("/convert/pdf-scanner")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/convert/pdf-scanner");
          }}
          aria-label="Drop files here or click to browse"
        >
          {/* Upload icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-14 h-14 mb-2 text-on-surface-variant/40"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-base font-medium text-on-surface-variant">
            Drop files here or click to browse
          </p>
          <p className="text-xs mt-2" style={{ color: "color-mix(in srgb, var(--tk-on-surface-variant) 40%, transparent)" }}>
            Support: PDF, JPEG, PNG (Max 50MB)
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- JSON to CSV Section ---------- */

function JsonToCsvSection() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden col-span-full lg:col-span-8 rounded-[32px] glass tonal-container p-[33px] flex flex-col gap-8">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold font-display text-on-surface tracking-tight">
            JSON to CSV
          </h2>
          <p className="text-sm text-on-surface-variant">
            Flatten hierarchical data structures instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/convert/json-to-csv")}
          className="flex items-center justify-center p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          aria-label="Open JSON to CSV tool"
        >
          <ArrowRightIcon />
        </button>
      </div>

      {/* Side-by-side editors */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input JSON */}
        <div className="flex-1 relative min-h-[294px]">
          <label className="absolute -top-1 left-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant z-10">
            Input JSON
          </label>
          <div className="absolute inset-0 top-6 rounded-[48px] p-[17px] overflow-auto"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            }}
          >
            <pre className="text-sm font-mono text-on-surface-variant/60 whitespace-pre-wrap">
              <code>{`[{"id": 1, "name": "Toolify"}]`}</code>
            </pre>
          </div>
        </div>

        {/* Output CSV */}
        <div className="flex-1 relative min-h-[294px]">
          <label className="absolute -top-1 left-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant z-10">
            Output CSV
          </label>
          <div className="absolute inset-0 top-6 rounded-[48px] p-[17px] overflow-auto"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            }}
          >
            <pre className="text-sm font-mono text-on-surface-variant/60 whitespace-pre-wrap">
              <code>id, name{"\n"}1, Toolify</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Convert button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/convert/json-to-csv")}
          className="inline-flex items-center gap-2 px-10 py-3 rounded-full border cursor-pointer transition-all hover:bg-primary/10"
          style={{
            borderColor: "var(--tk-primary)",
            color: "var(--tk-primary)",
          }}
        >
          <JsonIcon />
          <span className="font-semibold text-sm">Convert Data</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Roman to Decimal Section ---------- */

function RomanToDecimalSection() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden col-span-full lg:col-span-4 rounded-[32px] glass tonal-container p-[33px] flex flex-col justify-between gap-6">
      {/* Header with icon */}
      <div className="flex items-center gap-4">
        <span
          className="flex items-center justify-center w-[48px] h-[48px] rounded-full shrink-0"
          style={{
            backgroundColor: "color-mix(in srgb, var(--tk-tertiary) 10%, transparent)",
            color: "var(--tk-tertiary)",
          }}
          aria-hidden="true"
        >
          <RomanIcon />
        </span>
        <h2 className="text-2xl font-bold font-display text-on-surface tracking-tight">
          Roman to<br />Decimal
        </h2>
      </div>

      {/* Input field */}
      <div className="flex flex-col gap-4 w-full">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Roman Numeral
        </label>
        <div
          className="w-full rounded-[48px] px-6 py-4"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
          }}
        >
          <span className="text-2xl font-display text-on-surface-variant/60 cursor-text"
            onClick={() => navigate("/convert/roman-to-decimal")}
          >
            e.g. MCMXCIV
          </span>
        </div>
      </div>

      {/* Result display with neon glow */}
      <div className="relative rounded-xl p-6 overflow-hidden"
        style={{
          backgroundColor: "var(--tk-surface-container-lowest)",
          border: "1px solid color-mix(in srgb, var(--tk-primary) 10%, transparent)",
        }}
      >
        {/* Neon background glow */}
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
        onClick={() => navigate("/convert/roman-to-decimal")}
        className="w-full py-4 rounded-full font-semibold text-sm cursor-pointer transition-all hover:brightness-110"
        style={{
          backgroundColor: "var(--tk-surface-container-highest)",
          color: "var(--tk-on-surface)",
        }}
      >
        Convert
      </button>
    </div>
  );
}

/* ---------- Page Layout ---------- */

export default function ConvertersHome() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      {/* Page header */}
      <section className="flex flex-col gap-2 pt-4 sm:pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold font-display text-on-surface tracking-tight leading-tight">
          Converters
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant max-w-[672px] leading-relaxed">
          Streamline your workflow with our high-performance precision tools.
          Fast, secure, and entirely browser-based.
        </p>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PdfScannerSection />
        <JsonToCsvSection />
        <RomanToDecimalSection />
      </div>

      {/* Footer tools count */}
      <footer className="pb-4 text-center">
        <p className="text-xs text-on-surface-variant">
          3 tools in Converters
        </p>
      </footer>
    </div>
  );
}
