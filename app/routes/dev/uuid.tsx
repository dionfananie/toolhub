import { useState, useCallback } from "react";
import type { Route } from "./+types/uuid";
import { useNavigate } from "react-router";
import { JsonLd } from "~/components/json-ld";
import { ogMeta, webPageSchema, softwareAppSchema, breadcrumbSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "UUID Generator — Toolhub";
  const description =
    "Generate UUID v4, v7, and other UUID versions in bulk. Copy individual UUIDs or all at once.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/dev/uuid"),
  ];
}

/* ---------- UUID Versions ---------- */

interface UuidVersion {
  id: string;
  label: string;
  description: string;
}

const UUID_VERSIONS: UuidVersion[] = [
  { id: "v4", label: "UUID v4", description: "Random" },
  { id: "v7", label: "UUID v7", description: "Time-ordered random" },
  { id: "v1", label: "UUID v1 (basic)", description: "Time-based" },
  { id: "nil", label: "Nil UUID", description: "All zeros" },
];

/* ---------- UUID Generators ---------- */

function uuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function uuidV7(): string {
  const timestamp = Date.now().toString(16).padStart(12, "0");
  const random1 = (Math.random() * 0x10000) | 0;
  const random2 = (Math.random() * 0x10000) | 0;
  const random3 = (Math.random() * 0x10000) | 0;
  const random4 = (Math.random() * 0x10000) | 0;
  const random5 = (Math.random() * 0x10000) | 0;
  const random6 = (Math.random() * 0x10000) | 0;

  return `${timestamp.slice(0, 8)}-${timestamp.slice(8, 12)}-7${(random1 & 0xfff).toString(16).padStart(3, "0")}-${(0x80 | (random2 & 0x3f)).toString(16)}${random3.toString(16).padStart(3, "0")}-${random4.toString(16).padStart(4, "0")}${random5.toString(16).padStart(4, "0")}${random6.toString(16).padStart(4, "0")}`;
}

function uuidV1(): string {
  const now = Date.now();
  const timeHex = (now * 10000 + 0x01b21dd213814000n).toString(16).padStart(16, "0");
  const clockSeq = ((Math.random() * 0x4000) | 0).toString(16).padStart(4, "0");
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0"),
  ).join("");

  return `${timeHex.slice(8, 12)}-${timeHex.slice(4, 8)}-1${timeHex.slice(1, 4)}-${clockSeq.slice(0, 2)}${(0x80 | parseInt(clockSeq.slice(2, 3), 16)).toString(16)}-${node}`;
}

function uuidNil(): string {
  return "00000000-0000-0000-0000-000000000000";
}

function generateUuid(version: string): string {
  switch (version) {
    case "v4":
      return uuidV4();
    case "v7":
      return uuidV7();
    case "v1":
      return uuidV1();
    case "nil":
      return uuidNil();
    default:
      return uuidV4();
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

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

/* ---------- Main Component ---------- */

export default function UuidGenerator() {
  const navigate = useNavigate();
  const [version, setVersion] = useState("v4");
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => uuidV4()),
  );
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const generate = useCallback(() => {
    const generated = Array.from({ length: count }, () => generateUuid(version));
    setUuids(generated);
  }, [version, count]);

  const copyAll = useCallback(async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    showToast(`Copied ${uuids.length} UUID${uuids.length !== 1 ? "s" : ""}`);
  }, [uuids, showToast]);

  const copyOne = useCallback(async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    showToast("UUID copied");
  }, [showToast]);

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in pt-6">
      {/* JSON-LD structured data */}
      <JsonLd data={webPageSchema("UUID Generator — Toolhub", "Generate UUID v4, v7, and other UUID versions in bulk.", "/dev/uuid")} />
      <JsonLd data={softwareAppSchema("UUID Generator", "Generate UUID v4, v7, and other UUID versions in bulk. Copy individual UUIDs or all at once.", "/dev/uuid")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Developer Tools", url: "/dev" },
        { name: "UUID Generator", url: "/dev/uuid" },
      ])} />

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
          UUID Generator
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Generate UUIDs in bulk with support for multiple versions.
        </p>
      </section>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Version selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Version
          </label>
          <div className="flex gap-2">
            {UUID_VERSIONS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVersion(v.id)}
                title={v.description}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  version === v.id
                    ? "neon-gradient text-[#66002c]"
                    : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
                }`}
                aria-label={`${v.label} — ${v.description}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="count">
            Count
          </label>
          <input
            id="count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value) || 1)))}
            className="w-20 px-4 py-2 rounded-full text-xs font-medium outline-none text-center"
            style={{
              backgroundColor: "var(--tk-surface-container-highest)",
              color: "var(--tk-on-surface)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 15%, transparent)",
            }}
            aria-label="Number of UUIDs to generate"
          />
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={generate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90 neon-gradient text-[#66002c]"
        >
          <RefreshIcon />
          Generate
        </button>

        {/* Copy all button */}
        <button
          type="button"
          onClick={copyAll}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all tonal-container-highest text-on-surface hover:brightness-110"
        >
          <CopyIcon />
          Copy All
        </button>
      </div>

      {/* UUID list */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Generated UUIDs ({uuids.length})
        </label>
        <div className="flex flex-col gap-2">
          {uuids.map((uuid, idx) => (
            <div
              key={idx}
              className="group flex items-center justify-between p-3 rounded-card tonal-container-highest transition-all hover:glass"
            >
              <code className="text-sm font-mono text-on-surface tracking-wide">
                {uuid}
              </code>
              <button
                type="button"
                onClick={() => copyOne(uuid)}
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
                aria-label="Copy UUID"
              >
                <CopyIcon />
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">About UUID versions</p>
        <ul className="space-y-1">
          <li><strong className="text-on-surface">v4</strong> — Random UUID. 122 bits of random data.</li>
          <li><strong className="text-on-surface">v7</strong> — Time-ordered random UUID. Monotonically increasing with timestamps, good for databases.</li>
          <li><strong className="text-on-surface">v1 (basic)</strong> — Time-based UUID using MAC address (randomized node).</li>
          <li><strong className="text-on-surface">Nil</strong> — The "zero" UUID. All bits are zero.</li>
        </ul>
      </div>
    </div>
  );
}
