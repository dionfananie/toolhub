import { useState, useMemo } from "react";
import type { Route } from "./+types/diff";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Diff Checker — Toolhub" },
    {
      name: "description",
      content:
        "Compare two texts side-by-side and instantly see the differences. Highlight added, removed, and unchanged lines.",
    },
  ];
}

/* ---------- Simple LCS-based Diff Algorithm ---------- */

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  value: string;
  leftLine?: number;
  rightLine?: number;
}

/**
 * A simple line-based diff using a longest-common-subsequence approach.
 * Returns a merged list of lines indicating what was added/removed/unchanged.
 */
function computeDiff(left: string, right: string): DiffLine[] {
  const leftLines = left.split("\n");
  const rightLines = right.split("\n");

  // Build LCS table
  const m = leftLines.length;
  const n = rightLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (leftLines[i - 1] === rightLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to produce diff
  const result: DiffLine[] = [];
  let i = m, j = n;
  const temp: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      temp.push({ type: "unchanged", value: leftLines[i - 1], leftLine: i, rightLine: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ type: "added", value: rightLines[j - 1], rightLine: j });
      j--;
    } else {
      temp.push({ type: "removed", value: leftLines[i - 1], leftLine: i });
      i--;
    }
  }

  return temp.reverse();
}

/* ---------- Icons ---------- */

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/* ---------- Sub-components ---------- */

function DiffPanel({
  lines,
  title,
  side,
}: {
  lines: DiffLine[];
  title: string;
  side: "left" | "right";
}) {
  return (
    <div className="flex-1 flex flex-col rounded-[48px] overflow-hidden"
      style={{
        backgroundColor: "var(--tk-surface-container-lowest)",
        border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
      }}
    >
      <div className="px-5 py-3 border-b"
        style={{ borderColor: "color-mix(in srgb, var(--tk-outline-variant) 15%, transparent)" }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {title}
        </span>
      </div>
      <div className="overflow-auto p-0 font-mono text-xs leading-relaxed max-h-[500px]">
        {lines.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-on-surface-variant/40">
            No content
          </div>
        ) : (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                let bgColor = "transparent";
                let textColor = "var(--tk-on-surface-variant)";
                let lineNumberColor = "var(--tk-on-surface-variant)";
                let prefix = " ";

                if (line.type === "added" && side === "right") {
                  bgColor = "color-mix(in srgb, #22c55e 10%, transparent)";
                  textColor = "#22c55e";
                  lineNumberColor = "#22c55e";
                  prefix = "+";
                } else if (line.type === "removed" && side === "left") {
                  bgColor = "color-mix(in srgb, #ef4444 10%, transparent)";
                  textColor = "#ef4444";
                  lineNumberColor = "#ef4444";
                  prefix = "-";
                } else if (line.type === "added" && side === "left") {
                  // hidden on left
                  return null;
                } else if (line.type === "removed" && side === "right") {
                  // hidden on right
                  return null;
                }

                const lineNum = side === "left" ? line.leftLine : line.rightLine;

                return (
                  <tr key={idx} style={{ backgroundColor: bgColor }}>
                    <td className="w-10 text-right px-2 py-0.5 select-none"
                      style={{ color: lineNumberColor }}>
                      {lineNum ?? ""}
                    </td>
                    <td className="w-4 px-1 py-0.5 select-none font-bold"
                      style={{ color: textColor }}>
                      {prefix}
                    </td>
                    <td className="px-2 py-0.5 whitespace-pre-wrap break-all"
                      style={{ color: textColor }}>
                      {line.value || " "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function DiffChecker() {
  const navigate = useNavigate();
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const diffLines = useMemo(
    () => (showDiff ? computeDiff(leftText, rightText) : []),
    [leftText, rightText, showDiff],
  );

  const addedCount = diffLines.filter((l) => l.type === "added").length;
  const removedCount = diffLines.filter((l) => l.type === "removed").length;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-fade-in pt-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate("/text")}
        className="self-start inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <ArrowRightIcon />
        Back to Text & Data
      </button>

      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-on-surface tracking-tight">
          Diff Checker
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Compare two texts side-by-side and see exactly what changed.
        </p>
      </section>

      {/* Input areas */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Original Text
          </label>
          <textarea
            value={leftText}
            onChange={(e) => { setLeftText(e.target.value); setShowDiff(false); }}
            placeholder="Paste original text here..."
            rows={8}
            className="w-full rounded-[48px] p-5 resize-y outline-none text-sm leading-relaxed transition-colors focus:border-primary/40 min-h-[200px]"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
              color: "var(--tk-on-surface)",
            }}
            aria-label="Original text"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Changed Text
          </label>
          <textarea
            value={rightText}
            onChange={(e) => { setRightText(e.target.value); setShowDiff(false); }}
            placeholder="Paste changed text here..."
            rows={8}
            className="w-full rounded-[48px] p-5 resize-y outline-none text-sm leading-relaxed transition-colors focus:border-primary/40 min-h-[200px]"
            style={{
              backgroundColor: "var(--tk-surface-container-lowest)",
              border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
              color: "var(--tk-on-surface)",
            }}
            aria-label="Changed text"
          />
        </div>
      </div>

      {/* Compare button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowDiff(true)}
          disabled={!leftText && !rightText}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90 neon-gradient text-[#66002c] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
            <path d="M12 3v18" />
            <path d="M5 10l7-7 7 7" />
            <path d="M5 14l7 7 7-7" />
          </svg>
          Compare
        </button>

        {showDiff && (addedCount > 0 || removedCount > 0) && (
          <div className="flex gap-3 text-xs">
            <span style={{ color: "#22c55e" }}>
              +{addedCount} added
            </span>
            <span style={{ color: "#ef4444" }}>
              -{removedCount} removed
            </span>
          </div>
        )}
      </div>

      {/* Diff output */}
      {showDiff && (
        <div className="flex flex-col lg:flex-row gap-4">
          <DiffPanel lines={diffLines} title="Original" side="left" />
          <DiffPanel lines={diffLines} title="Changed" side="right" />
        </div>
      )}

      {showDiff && diffLines.length === 0 && (
        <div className="flex items-center justify-center p-8 rounded-card tonal-container">
          <p className="text-sm text-on-surface-variant">No differences found — the texts are identical.</p>
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">How it works</p>
        <p>
          Uses a line-based diff algorithm (Longest Common Subsequence) to
          compare texts. Lines in <span style={{ color: "#22c55e" }}>green</span>{" "}
          were added, lines in <span style={{ color: "#ef4444" }}>red</span>{" "}
          were removed. All processing happens in your browser.
        </p>
      </div>
    </div>
  );
}
