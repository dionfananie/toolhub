import { useState, useMemo, useCallback } from "react";
import type { Route } from "./+types/regex";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Regex Tester — Toolhub" },
    {
      name: "description",
      content:
        "Test regular expressions in real-time. See matches highlighted in your test string with capture group details.",
    },
  ];
}

/* ---------- Icons ---------- */

interface MatchResult {
  full: string;
  groups: string[];
  index: number;
}

/* ---------- Sub-component: Match Highlighting ---------- */

function HighlightedText({
  text,
  matches,
}: {
  text: string;
  matches: MatchResult[];
}) {
  if (matches.length === 0) {
    return <span className="text-on-surface-variant/40">No matches</span>;
  }

  // Sort matches by index
  const sorted = [...matches].sort((a, b) => a.index - b.index);
  const parts: { start: number; end: number; match: MatchResult }[] = [];

  for (const m of sorted) {
    // Try to find this match in the text at the expected position
    const idx = text.indexOf(m.full, Math.max(0, m.index));
    if (idx >= 0) {
      parts.push({ start: idx, end: idx + m.full.length, match: m });
    }
  }

  // Merge overlapping ranges
  const merged: { start: number; end: number }[] = [];
  for (const p of parts) {
    if (merged.length > 0 && p.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, p.end);
    } else {
      merged.push({ start: p.start, end: p.end });
    }
  }

  // If no valid positions found, show raw text
  if (merged.length === 0) {
    return <span>{text}</span>;
  }

  const segments: { text: string; highlighted: boolean }[] = [];
  let cursor = 0;

  for (const range of merged) {
    if (range.start > cursor) {
      segments.push({ text: text.slice(cursor, range.start), highlighted: false });
    }
    segments.push({ text: text.slice(range.start, range.end), highlighted: true });
    cursor = range.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false });
  }

  return (
    <span>
      {segments.map((seg, idx) =>
        seg.highlighted ? (
          <mark
            key={idx}
            className="px-0.5 rounded"
            style={{
              backgroundColor: "color-mix(in srgb, var(--tk-primary) 30%, transparent)",
              color: "var(--tk-on-surface)",
            }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={idx}>{seg.text}</span>
        ),
      )}
    </span>
  );
}

/* ---------- Main Component ---------- */

export default function RegexTester() {
  const navigate = useNavigate();
  const [pattern, setPattern] = useState("([A-Z])\\w+");
  const [flags, setFlags] = useState("gm");
  const [testText, setTestText] = useState(
    "Hello World\nThis is a Regex Tester\nExtract WORDS Like These\n123-456-7890",
  );
  const [error, setError] = useState<string | null>(null);

  const ALL_FLAGS = ["g", "i", "m", "s", "u", "y"] as const;

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags((flags + flag).split("").sort().join(""));
    }
  };

  const matches = useMemo((): MatchResult[] => {
    setError(null);
    if (!pattern) return [];

    try {
      const regex = new RegExp(pattern, flags);
      const results: MatchResult[] = [];
      let match: RegExpExecArray | null;

      // Use global flag for loop, or test once
      if (flags.includes("g")) {
        const gRegex = new RegExp(pattern, flags);
        while ((match = gRegex.exec(testText)) !== null) {
          results.push({
            full: match[0],
            groups: Array.from(match).slice(1),
            index: match.index,
          });
          // Prevent infinite loop on zero-length matches
          if (match.index === gRegex.lastIndex) {
            gRegex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          results.push({
            full: match[0],
            groups: Array.from(match).slice(1),
            index: match.index,
          });
        }
      }

      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex");
      return [];
    }
  }, [pattern, flags, testText]);

  const matchCount = matches.length;
  const hasPatternSyntaxError = error !== null && !testText;
  const hasTestData = testText.length > 0;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto animate-fade-in pt-6">
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
          Regex Tester
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Test regular expressions with real-time match highlighting and
          capture group details.
        </p>
      </section>

      {/* Pattern input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Pattern
        </label>
        <div
          className="flex items-center gap-0 rounded-full overflow-hidden"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: `1px solid color-mix(in srgb, ${error ? "#ef4444" : "var(--tk-outline-variant)"} 20%, transparent)`,
          }}
        >
          <span className="pl-5 text-sm font-mono text-on-surface-variant select-none">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern"
            className="flex-1 py-4 px-2 bg-transparent text-sm font-mono outline-none"
            style={{ color: "var(--tk-on-surface)" }}
            aria-label="Regex pattern"
            spellCheck={false}
          />
          <span className="text-sm font-mono text-on-surface-variant select-none">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value.split("").filter(f => ALL_FLAGS.includes(f as typeof ALL_FLAGS[number])).sort().join(""))}
            className="w-16 py-4 pr-5 bg-transparent text-sm font-mono outline-none"
            style={{ color: "var(--tk-tertiary)" }}
            aria-label="Regex flags"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Flag toggles */}
      <div className="flex flex-wrap gap-2">
        {ALL_FLAGS.map((flag) => (
          <button
            key={flag}
            type="button"
            onClick={() => toggleFlag(flag)}
            className={`shrink-0 w-10 h-10 rounded-full text-sm font-mono font-bold transition-all cursor-pointer ${
              flags.includes(flag)
                ? "neon-gradient text-[#66002c]"
                : "tonal-container-highest text-on-surface-variant hover:text-on-surface"
            }`}
            aria-label={`Toggle ${flag} flag`}
            title={flag === "g" ? "Global" : flag === "i" ? "Case insensitive" : flag === "m" ? "Multiline" : flag === "s" ? "Dotall" : flag === "u" ? "Unicode" : "Sticky"}
          >
            {flag}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-card"
          style={{
            backgroundColor: "color-mix(in srgb, #ef4444 10%, transparent)",
            border: "1px solid color-mix(in srgb, #ef4444 20%, transparent)",
          }}
        >
          <p className="text-xs font-mono" style={{ color: "#ef4444" }}>
            {error}
          </p>
        </div>
      )}

      {/* Test string */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Test String
        </label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Enter test string..."
          rows={6}
          className="w-full rounded-[48px] p-5 resize-y outline-none text-sm font-mono leading-relaxed transition-colors focus:border-primary/40"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            color: "var(--tk-on-surface)",
          }}
          aria-label="Test string"
          spellCheck={false}
        />
      </div>

      {/* Match count */}
      {hasTestData && !error && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-on-surface-variant">Matches:</span>
          <span className="font-bold font-display text-primary text-lg">{matchCount}</span>
          {matchCount > 0 && (
            <span className="text-xs text-on-surface-variant/60">
              ({matches.length > 0 && matches[0].groups.length > 0 ? `${matches[0].groups.length} capture groups` : "no capture groups"})
            </span>
          )}
        </div>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Match Details
          </label>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-auto">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-card"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--tk-primary) 5%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--tk-primary) 10%, transparent)",
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-semibold text-on-surface-variant">
                    #{idx + 1}
                  </span>
                  <code className="text-sm font-mono text-primary font-medium break-all">
                    {m.full}
                  </code>
                  <span className="text-[10px] text-on-surface-variant/60 ml-auto">
                    pos {m.index}
                  </span>
                </div>
                {m.groups.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {m.groups.map((g, gIdx) =>
                      g !== undefined && (
                        <code
                          key={gIdx}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--tk-tertiary) 10%, transparent)",
                            color: "var(--tk-tertiary)",
                          }}
                        >
                          ${gIdx + 1}: {g}
                        </code>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview */}
      {!error && testText && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Highlighted Preview
          </label>
          <div
            className="w-full rounded-[48px] p-5 overflow-auto text-sm font-mono leading-relaxed"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
              color: "var(--tk-on-surface)",
            }}
          >
            <HighlightedText text={testText} matches={matches} />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">About Regex</p>
        <p>
          Tests JavaScript-compatible regular expressions. Supports all standard
          flags (g, i, m, s, u, y). Match positions and capture group values
          are displayed for each result. All processing is client-side.
        </p>
      </div>
    </div>
  );
}
