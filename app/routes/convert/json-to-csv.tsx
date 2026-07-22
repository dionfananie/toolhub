import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { JsonLd } from "~/components/json-ld";
import { ogMeta, webPageSchema, softwareAppSchema, breadcrumbSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "JSON to CSV — Toolhub";
  const description =
    "Flatten hierarchical JSON data into CSV format instantly. Paste your JSON and get clean CSV output.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/convert/json-to-csv"),
  ];
}

export default function JsonToCsv() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto animate-fade-in pt-6">
      {/* JSON-LD structured data */}
      <JsonLd data={webPageSchema("JSON to CSV — Toolhub", "Flatten hierarchical JSON data into CSV format instantly.", "/convert/json-to-csv")} />
      <JsonLd data={softwareAppSchema("JSON to CSV", "Flatten hierarchical JSON data into CSV format instantly. Paste your JSON and get clean CSV output.", "/convert/json-to-csv")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Converters", url: "/convert" },
        { name: "JSON to CSV", url: "/convert/json-to-csv" },
      ])} />

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
          JSON to CSV
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Flatten hierarchical data structures into clean CSV output instantly.
        </p>
      </section>

      {/* Side-by-side editors */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative min-h-[320px]">
          <label className="absolute -top-1 left-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant z-10">
            Input JSON
          </label>
          <textarea
            className="absolute inset-0 top-6 rounded-[48px] p-5 resize-none outline-none text-sm font-mono leading-relaxed"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
              color: "var(--tk-on-surface)",
            }}
            defaultValue='[{"id": 1, "name": "Toolify"}]'
            placeholder='Paste your JSON here...'
            aria-label="Input JSON"
          />
        </div>

        <div className="flex-1 relative min-h-[320px]">
          <label className="absolute -top-1 left-4 text-xs font-semibold uppercase tracking-wider text-on-surface-variant z-10">
            Output CSV
          </label>
          <div
            className="absolute inset-0 top-6 rounded-[48px] p-5 overflow-auto"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
              color: "var(--tk-on-surface)",
            }}
          >
            <pre className="text-sm font-mono text-on-surface-variant/60 whitespace-pre-wrap">
              <code>id, name{"\n"}1, Toolify</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Convert button */}
      <div className="flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-10 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90 neon-gradient text-[#66002c]"
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
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Convert Data
        </button>
      </div>

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">How it works</p>
        <p>
          Paste valid JSON in the left panel. The converter will flatten nested
          objects into CSV columns using dot notation for keys. Supports arrays
          of objects, nested objects, and primitive values.
        </p>
      </div>
    </div>
  );
}
