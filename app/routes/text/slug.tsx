import { useState, useMemo } from "react";
import type { Route } from "./+types/slug";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Slug Generator — Toolhub" },
    {
      name: "description",
      content:
        "Generate clean, URL-friendly slugs from any text. Supports custom separators, prefix, and suffix options.",
    },
  ];
}

/* ---------- Slug Helpers ---------- */

function generateSlug(
  text: string,
  separator: string,
  lowercase: boolean,
  maxLength: number,
): string {
  let slug = text
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // remove diacritics
    .replace(/[^\w\s-]/g, "") // remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, " ") // collapse whitespace and underscores
    .replace(/-+/g, " ") // collapse multiple hyphens
    .trim();

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Replace spaces with separator
  slug = slug.replace(/\s+/g, separator);

  // Trim separator from edges
  slug = slug.replace(new RegExp(`^${escapeRegex(separator)}+|${escapeRegex(separator)}+$`, "g"), "");

  // Truncate
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`${escapeRegex(separator)}+[^${escapeRegex(separator)}]*$`), "");
  }

  return slug;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

export default function SlugGenerator() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(80);
  const [toast, setToast] = useState<string | null>(null);

  const slug = useMemo(
    () => generateSlug(input, separator, lowercase, maxLength),
    [input, separator, lowercase, maxLength],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const copySlug = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    showToast("Slug copied to clipboard");
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
          Slug Generator
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Generate clean, URL-friendly slugs from any text input.
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
          placeholder="e.g. My Awesome Blog Post Title!"
          rows={3}
          className="w-full rounded-[48px] p-5 resize-y outline-none text-sm leading-relaxed transition-colors focus:border-primary/40"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            color: "var(--tk-on-surface)",
          }}
          aria-label="Input text for slug generation"
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-6">
        {/* Separator */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="separator">
            Separator
          </label>
          <div className="flex gap-2">
            {["-", "_", ".", "~"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeparator(s)}
                className={`w-10 h-10 rounded-full text-sm font-mono font-bold transition-all cursor-pointer ${
                  separator === s
                    ? "neon-gradient text-[#66002c]"
                    : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
                aria-label={`Use "${s}" separator`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Lowercase */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Options
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-on-surface">Lowercase</span>
          </label>
        </div>

        {/* Max length */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="maxLength">
            Max Length: {maxLength}
          </label>
          <input
            id="maxLength"
            type="range"
            min={0}
            max={200}
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="w-32 accent-primary"
            aria-label="Maximum slug length"
          />
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Generated Slug
          </label>
          {slug && (
            <button
              type="button"
              onClick={copySlug}
              className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <CopyIcon />
              Copy
            </button>
          )}
        </div>
        <div
          className="w-full min-h-[60px] rounded-[48px] px-6 py-4 flex items-center"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-primary) 10%, transparent)",
          }}
        >
          {slug ? (
            <code className="text-base font-mono text-primary font-medium break-all">
              {slug}
            </code>
          ) : (
            <span className="text-sm text-on-surface-variant/40">
              Slug will appear here
            </span>
          )}
        </div>
      </div>

      {/* Character count */}
      {slug && (
        <div className="text-xs text-on-surface-variant">
          {slug.length} character{slug.length !== 1 ? "s" : ""}
          {maxLength > 0 && slug.length >= maxLength && " (truncated)"}
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">About slugs</p>
        <p>
          A slug is a URL-friendly version of a page title or phrase. It
          typically contains only lowercase letters, numbers, and a separator
          character. This tool also normalizes unicode characters (removes
          accents) for broad compatibility.
        </p>
      </div>
    </div>
  );
}
