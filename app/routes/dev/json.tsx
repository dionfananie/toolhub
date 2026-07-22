import { useState } from "react";
import type { Route } from "./+types/json";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "JSON Formatter — Toolhub" },
    {
      name: "description",
      content:
        "Format, validate, and minify JSON payloads. Pretty-print with configurable indentation or compress to a single line.",
    },
  ];
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

type Action = "format" | "minify" | "validate";

export default function JsonFormatter() {
  const navigate = useNavigate();
  const [input, setInput] = useState('{"name": "Toolhub", "version": 1, "tools": ["json", "uuid"]}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const processJson = (action: Action) => {
    setError(null);
    try {
      const parsed = JSON.parse(input);
      switch (action) {
        case "format":
          setOutput(JSON.stringify(parsed, null, indent));
          break;
        case "minify":
          setOutput(JSON.stringify(parsed));
          break;
        case "validate":
          setOutput(JSON.stringify(parsed, null, indent));
          showToast("Valid JSON");
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    showToast("Copied to clipboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      processJson("format");
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto animate-fade-in pt-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-full glass text-sm font-medium text-on-surface animate-fade-in shadow-lg">
          {toast}
        </div>
      )}

      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate("/dev")}
        className="self-start inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Developer Tools
      </button>

      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          JSON Formatter
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Format, validate, and minify JSON with configurable indentation.
        </p>
      </section>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Input JSON
        </label>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          onKeyDown={handleKeyDown}
          placeholder='Paste JSON here...'
          rows={8}
          className="w-full rounded-[48px] p-5 resize-y outline-none text-sm font-mono leading-relaxed transition-colors focus:border-primary/40"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            color: "var(--tk-on-surface)",
          }}
          aria-label="JSON input"
          spellCheck={false}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => processJson("format")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90 neon-gradient text-[#66002c]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Format
        </button>

        <button
          type="button"
          onClick={() => processJson("minify")}
          className="px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all tonal-container-highest text-on-surface hover:brightness-110"
        >
          Minify
        </button>

        <button
          type="button"
          onClick={() => processJson("validate")}
          className="px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all tonal-container-highest text-on-surface hover:brightness-110"
        >
          Validate
        </button>

        {/* Indent control */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-on-surface-variant" htmlFor="indent">
            Indent:
          </label>
          <select
            id="indent"
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-3 py-1.5 rounded-full text-xs font-medium outline-none cursor-pointer"
            style={{
              backgroundColor: "var(--tk-surface-container-highest)",
              color: "var(--tk-on-surface)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 15%, transparent)",
            }}
            aria-label="Indentation size"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
            <option value={0}>Tab</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-card"
          style={{
            backgroundColor: "color-mix(in srgb, #ef4444 10%, transparent)",
            border: "1px solid color-mix(in srgb, #ef4444 20%, transparent)",
          }}
        >
          <p className="text-sm font-mono" style={{ color: "#ef4444" }}>
            {error}
          </p>
        </div>
      )}

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
          className="w-full min-h-[120px] rounded-[48px] p-5 overflow-auto"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: `1px solid color-mix(in srgb, ${error ? "#ef4444" : "var(--tk-primary)"} 10%, transparent)`,
            color: "var(--tk-on-surface)",
          }}
        >
          {output ? (
            <pre className="text-sm font-mono whitespace-pre-wrap break-all">
              <code>{output}</code>
            </pre>
          ) : (
            <span className="text-sm text-on-surface-variant/40">
              {error ? "Fix the JSON and try again" : "Result will appear here"}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">Shortcut</p>
        <p>
          Press <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: "var(--tk-surface-container-highest)" }}>Cmd/Ctrl + Enter</kbd> to format quickly.
          All processing happens in your browser — nothing is uploaded.
        </p>
      </div>
    </div>
  );
}
