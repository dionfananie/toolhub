import { useState, useRef, useCallback } from "react";
import type { Route } from "./+types/base64";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Base64 Encoder / Decoder — Toolhub" },
    {
      name: "description",
      content:
        "Encode text or files to base64, or decode base64 back to readable text. Supports UTF-8, file upload, and copy to clipboard.",
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

function ArrowLeftRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

type Mode = "encode" | "decode";

export default function Base64Tool() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [error, setError] = useState<string | null>(null);
  const [charset, setCharset] = useState<"utf-8" | "latin-1">("utf-8");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const process = useCallback(() => {
    setError(null);
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        setOutput(btoa(binary));
      } else {
        const binary = atob(input);
        if (charset === "utf-8") {
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          setOutput(new TextDecoder().decode(bytes));
        } else {
          setOutput(binary);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
      setOutput("");
    }
  }, [input, mode, charset]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is a data URL, extract the base64 part
      const base64 = result.split(",")[1];
      if (base64) {
        setInput(base64);
        setMode("decode");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    showToast("Copied to clipboard");
  };

  const switchMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError(null);
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
          Base64 Encoder / Decoder
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Encode text or files to base64, or decode base64 strings back to readable text.
        </p>
      </section>

      {/* Mode toggle */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1 rounded-full tonal-container p-1">
          <button
            type="button"
            onClick={() => { setMode("encode"); setOutput(""); setError(null); }}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mode === "encode"
                ? "neon-gradient text-[#66002c]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => { setMode("decode"); setOutput(""); setError(null); }}
            className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mode === "decode"
                ? "neon-gradient text-[#66002c]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Decode
          </button>
        </div>

        {mode === "decode" && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-on-surface-variant" htmlFor="charset">
              Output:
            </label>
            <select
              id="charset"
              value={charset}
              onChange={(e) => setCharset(e.target.value as "utf-8" | "latin-1")}
              className="px-3 py-1.5 rounded-full text-xs font-medium outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--tk-surface-container-highest)",
                color: "var(--tk-on-surface)",
                border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 15%, transparent)",
              }}
              aria-label="Output character encoding"
            >
              <option value="utf-8">UTF-8</option>
              <option value="latin-1">Latin-1</option>
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={switchMode}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer tonal-container-highest"
          aria-label="Switch mode"
        >
          <ArrowLeftRightIcon />
          Switch
        </button>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          {mode === "decode" && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <UploadIcon />
              Upload File
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFile}
            className="hidden"
            aria-hidden="true"
          />
        </div>
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null); }}
          placeholder={mode === "encode" ? "Type or paste text to encode..." : "Paste base64 string to decode..."}
          rows={6}
          className="w-full rounded-[48px] p-5 resize-y outline-none text-sm font-mono leading-relaxed transition-colors focus:border-primary/40"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            color: "var(--tk-on-surface)",
          }}
          aria-label="Input"
          spellCheck={false}
        />
      </div>

      {/* Process button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={process}
          disabled={!input}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90 neon-gradient text-[#66002c] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeftRightIcon />
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
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
          className="w-full min-h-[100px] rounded-[48px] p-5 overflow-auto"
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
              {error ? "Fix the input and try again" : "Result will appear here"}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">About Base64</p>
        <p>
          Base64 encodes binary data into ASCII characters for safe transport
          over text-based protocols. Use <strong className="text-on-surface">Encode</strong> to
          convert text to base64, or <strong className="text-on-surface">Decode</strong> to reverse it.
          You can also decode a base64 data URL by uploading a file. All
          processing is done in your browser.
        </p>
      </div>
    </div>
  );
}
