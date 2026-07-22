import type { Route } from "./+types/home";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PDF Scanner — Toolhub" },
    {
      name: "description",
      content:
        "Transform physical documents into searchable PDFs with our OCR engine. Drag and drop files to get started.",
    },
  ];
}

export default function PdfScanner() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in pt-6">
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
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          PDF Scanner
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Transform physical documents into high-fidelity searchable PDFs
          using advanced OCR technology.
        </p>
      </section>

      {/* Drop zone */}
      <div
        className="flex flex-col items-center justify-center w-full min-h-[320px] rounded-[48px] border-2 border-dashed p-8 cursor-pointer hover:border-primary/40 transition-colors"
        style={{
          backgroundColor: "color-mix(in srgb, var(--tk-surface-container-lowest) 50%, transparent)",
          borderColor: "color-mix(in srgb, var(--tk-outline-variant) 30%, transparent)",
        }}
        role="button"
        tabIndex={0}
        aria-label="Drop files here or click to browse"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-16 h-16 mb-4 text-on-surface-variant/40"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-lg font-medium text-on-surface-variant">
          Drop files here or click to browse
        </p>
        <p className="text-sm mt-2 text-on-surface-variant/40">
          Support: PDF, JPEG, PNG (Max 50MB)
        </p>
      </div>

      {/* Feature list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "OCR Engine", desc: "High-accuracy text recognition in 100+ languages" },
          { title: "Searchable PDFs", desc: "Output files with selectable and searchable text" },
          { title: "Batch Processing", desc: "Convert multiple documents at once" },
          { title: "Secure & Private", desc: "Files processed in-browser, never uploaded" },
        ].map((feature) => (
          <div
            key={feature.title}
            className="p-4 rounded-card tonal-container"
          >
            <h3 className="text-sm font-semibold text-on-surface mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
