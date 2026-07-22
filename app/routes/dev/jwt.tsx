import { useState, useCallback } from "react";
import type { Route } from "./+types/jwt";
import { useNavigate } from "react-router";
import { JsonLd } from "~/components/json-ld";
import { ogMeta, webPageSchema, softwareAppSchema, breadcrumbSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "JWT Decoder — Toolhub";
  const description =
    "Decode JWT tokens and inspect the header, payload, and signature. Supports HS256, RS256, and other common algorithms.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/dev/jwt"),
  ];
}

/* ---------- JWT Decoding ---------- */

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  headerRaw: string;
  payloadRaw: string;
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters and add padding
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return atob(base64);
}

function decodeJwt(token: string): DecodedJwt | { error: string } {
  const parts = token.trim().split(".");

  if (parts.length !== 3) {
    return { error: "Invalid JWT format. Expected 3 parts separated by dots (header.payload.signature)." };
  }

  try {
    const headerRaw = base64UrlDecode(parts[0]);
    const payloadRaw = base64UrlDecode(parts[1]);

    const header = JSON.parse(headerRaw);
    const payload = JSON.parse(payloadRaw);

    return {
      header,
      payload,
      signature: parts[2],
      headerRaw,
      payloadRaw,
    };
  } catch (err) {
    return { error: `Failed to decode JWT: ${err instanceof Error ? err.message : "Invalid base64 or JSON"}` };
  }
}

function formatTimestamp(ts?: number): string {
  if (ts === undefined || ts === null) return "-";
  try {
    const d = new Date(ts * 1000);
    return d.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return `${ts}`;
  }
}

function isExpired(ts?: number): boolean {
  if (!ts) return false;
  return Date.now() > ts * 1000;
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

const EXAMPLE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.TaPncNwQfl4xt0w5bsoCQyggQgnqlqCfw_W6ebSJtxk";

/* ---------- Main Component ---------- */

export default function JwtDecoder() {
  const navigate = useNavigate();
  const [token, setToken] = useState(EXAMPLE_TOKEN);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const decoded = decodeJwt(token);

  const copyJson = async (json: string, label: string) => {
    await navigator.clipboard.writeText(json);
    showToast(`${label} copied to clipboard`);
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in pt-6">
      {/* JSON-LD structured data */}
      <JsonLd data={webPageSchema("JWT Decoder — Toolhub", "Decode JWT tokens and inspect the header, payload, and signature.", "/dev/jwt")} />
      <JsonLd data={softwareAppSchema("JWT Decoder", "Decode JWT tokens and inspect the header, payload, and signature. Supports HS256, RS256, and other common algorithms.", "/dev/jwt")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Developer Tools", url: "/dev" },
        { name: "JWT Decoder", url: "/dev/jwt" },
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
          JWT Decoder
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Decode JSON Web Tokens and inspect the header, payload, and
          signature. Token verification is not performed.
        </p>
      </section>

      {/* Token input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="jwt-token">
          JWT Token
        </label>
        <textarea
          id="jwt-token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT token here..."
          rows={4}
          className="w-full rounded-[48px] p-5 resize-y outline-none text-sm font-mono leading-relaxed transition-colors focus:border-primary/40"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: `1px solid color-mix(in srgb, ${"error" in decoded ? "#ef4444" : "var(--tk-outline-variant)"} 20%, transparent)`,
            color: "var(--tk-on-surface)",
          }}
          aria-label="JWT token"
          spellCheck={false}
        />
      </div>

      {/* Error */}
      {"error" in decoded && (
        <div className="p-3 rounded-card"
          style={{
            backgroundColor: "color-mix(in srgb, #ef4444 10%, transparent)",
            border: "1px solid color-mix(in srgb, #ef4444 20%, transparent)",
          }}
        >
          <p className="text-xs font-mono" style={{ color: "#ef4444" }}>
            {decoded.error}
          </p>
        </div>
      )}

      {/* Decoded result */}
      {"header" in decoded && (
        <>
          {/* Header section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Header
              </label>
              <button
                type="button"
                onClick={() => copyJson(JSON.stringify(decoded.header, null, 2), "Header")}
                className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <CopyIcon />
                Copy
              </button>
            </div>
            <div
              className="w-full rounded-[48px] p-5 overflow-auto"
              style={{
                backgroundColor: "color-mix(in srgb, var(--tk-tertiary) 5%, transparent)",
                border: "1px solid color-mix(in srgb, var(--tk-tertiary) 10%, transparent)",
                color: "var(--tk-on-surface)",
              }}
            >
              <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                <code>{JSON.stringify(decoded.header, null, 2)}</code>
              </pre>
            </div>
          </div>

          {/* Payload section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Payload
              </label>
              <button
                type="button"
                onClick={() => copyJson(JSON.stringify(decoded.payload, null, 2), "Payload")}
                className="inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <CopyIcon />
                Copy
              </button>
            </div>
            <div
              className="w-full rounded-[48px] p-5 overflow-auto"
              style={{
                backgroundColor: "color-mix(in srgb, var(--tk-primary) 5%, transparent)",
                border: "1px solid color-mix(in srgb, var(--tk-primary) 10%, transparent)",
                color: "var(--tk-on-surface)",
              }}
            >
              <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                <code>{JSON.stringify(decoded.payload, null, 2)}</code>
              </pre>
            </div>
          </div>

          {/* Timestamp claims */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Timestamp Claims
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Issued At (iat)", value: (decoded.payload as Record<string, unknown>).iat as number | undefined },
                { label: "Expiration (exp)", value: (decoded.payload as Record<string, unknown>).exp as number | undefined },
                { label: "Not Before (nbf)", value: (decoded.payload as Record<string, unknown>).nbf as number | undefined },
              ].map((claim) => {
                const expired = claim.label === "Expiration (exp)" && isExpired(claim.value);
                return (
                  <div
                    key={claim.label}
                    className="flex flex-col gap-1 p-3 rounded-card tonal-container"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      {claim.label}
                    </span>
                    <span className={`text-sm font-mono ${expired ? "text-red-400" : "text-on-surface"}`}>
                      {formatTimestamp(claim.value)}
                    </span>
                    {expired && (
                      <span className="text-[10px] font-medium text-red-400">Expired</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signature section */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Signature
            </label>
            <div
              className="w-full rounded-[48px] p-5 overflow-auto"
              style={{
                backgroundColor: "var(--tk-surface-container-lowest)",
                border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
                color: "var(--tk-on-surface)",
              }}
            >
              <code className="text-sm font-mono text-on-surface-variant/60 break-all">
                {decoded.signature}
              </code>
            </div>
          </div>
        </>
      )}

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">About JWT</p>
        <p>
          A JSON Web Token (JWT) consists of three base64url-encoded parts:
          header, payload, and signature. This tool decodes the first two parts
          and displays them as formatted JSON. It does <strong className="text-on-surface">not</strong>{" "}
          verify the signature. All processing is client-side.
        </p>
      </div>
    </div>
  );
}
