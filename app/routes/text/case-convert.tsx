import { useState } from "react";
import type { Route } from "./+types/case-convert";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Case Converter — Toolhub" },
    {
      name: "description",
      content:
        "Transform text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, and kebab-case.",
    },
  ];
}

/* ---------- Case Transformations ---------- */

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot";

interface CaseOption {
  id: CaseType;
  label: string;
  preview: string;
}

const CASE_OPTIONS: CaseOption[] = [
  { id: "upper", label: "UPPERCASE", preview: "THE QUICK BROWN FOX" },
  { id: "lower", label: "lowercase", preview: "the quick brown fox" },
  { id: "title", label: "Title Case", preview: "The Quick Brown Fox" },
  { id: "sentence", label: "Sentence case", preview: "The quick brown fox" },
  { id: "camel", label: "camelCase", preview: "theQuickBrownFox" },
  { id: "pascal", label: "PascalCase", preview: "TheQuickBrownFox" },
  { id: "snake", label: "snake_case", preview: "the_quick_brown_fox" },
  { id: "kebab", label: "kebab-case", preview: "the-quick-brown-fox" },
  { id: "constant", label: "CONSTANT_CASE", preview: "THE_QUICK_BROWN_FOX" },
  { id: "dot", label: "dot.case", preview: "the.quick.brown.fox" },
];

function toWords(text: string): string[] {
  // Split on whitespace, underscores, hyphens, dots, and camelCase boundaries
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_\-\.]+/)
    .map((w) => w.toLowerCase())
    .filter(Boolean);
}

function convertCase(text: string, type: CaseType): string {
  const words = toWords(text);
  if (words.length === 0) return "";

  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    case "sentence": {
      const lower = words.join(" ");
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    case "camel":
      return words[0] + words.slice(1).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    case "pascal":
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
    case "snake":
      return words.join("_");
    case "kebab":
      return words.join("-");
    case "constant":
      return words.join("_").toUpperCase();
    case "dot":
      return words.join(".");
  }
}

/* ---------- Icons ---------- */

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/* ---------- Main Component ---------- */

export default function CaseConverter() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>("lower");
  const [toast, setToast] = useState<string | null>(null);

  const output = convertCase(input, activeCase);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    showToast("Copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in pt-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-full glass text-sm font-medium text-on-surface animate-fade-in shadow-lg">
          {toast}
        </div>
      )}

      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate("/text")}
        className="self-start inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Text & Data
      </button>

      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          Case Converter
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Instantly transform text between uppercase, lowercase, title case, camelCase, and more.
        </p>
      </section>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text here..."
          rows={4}
          className="w-full rounded-[48px] p-5 resize-y outline-none text-sm leading-relaxed transition-colors focus:border-primary/40"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            color: "var(--tk-on-surface)",
          }}
          aria-label="Input text"
        />
      </div>

      {/* Case options */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Choose Case
        </span>
        <div className="flex flex-wrap gap-2">
          {CASE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveCase(opt.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCase === opt.id
                  ? "neon-gradient text-[#66002c]"
                  : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
              title={opt.preview}
              aria-label={`Convert to ${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Output
          </label>
          {output && (
            <button
              type="button"
              onClick={copyOutput}
              className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <CopyIcon />
              Copy
            </button>
          )}
        </div>
        <div
          className="w-full min-h-[80px] rounded-[48px] p-5 overflow-auto"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-primary) 10%, transparent)",
            color: "var(--tk-on-surface)",
          }}
        >
          {output ? (
            <pre className="text-sm whitespace-pre-wrap break-all font-mono">
              {output}
            </pre>
          ) : (
            <span className="text-sm text-on-surface-variant/40">
              Result will appear here
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">How it works</p>
        <p>
          Splits input on whitespace, underscores, hyphens, dots, and camelCase
          boundaries, then rejoins using the selected case convention. All
          processing happens in your browser.
        </p>
      </div>
    </div>
  );
}
