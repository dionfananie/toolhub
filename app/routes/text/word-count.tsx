import { useState, useMemo } from "react";
import type { Route } from "./+types/word-count";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Word Counter — Toolhub" },
    {
      name: "description",
      content:
        "Count words, characters, sentences, paragraphs, and reading time in any text. Fast and private — all in your browser.",
    },
  ];
}

interface WordStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
}

function computeStats(text: string): WordStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? trimmed.split(/[.!?]+\s*/).filter(Boolean).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;

  const readingMinutes = words / 250;
  const speakingMinutes = words / 183;

  const fmtTime = (minutes: number): string => {
    if (minutes < 1) return "< 1 min";
    const m = Math.round(minutes);
    const h = Math.floor(m / 60);
    const rem = m % 60;
    if (h > 0) return `${h}h ${rem}m`;
    return `${m} min`;
  };

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime: fmtTime(readingMinutes),
    speakingTime: fmtTime(speakingMinutes),
  };
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export default function WordCounter() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const stats = useMemo(() => computeStats(text), [text]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const copyStats = async () => {
    const summary = `Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading time: ${stats.readingTime}
Speaking time: ${stats.speakingTime}`;
    await navigator.clipboard.writeText(summary);
    showToast("Stats copied to clipboard");
  };

  const clearText = () => {
    setText("");
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
          Word Counter
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed">
          Count words, characters, sentences, paragraphs, and estimate reading time in any text.
        </p>
      </section>

      {/* Text input */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Your Text
          </label>
          {text && (
            <button
              type="button"
              onClick={clearText}
              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={8}
          className="w-full rounded-[48px] p-5 resize-y outline-none text-sm leading-relaxed transition-colors focus:border-primary/40 min-h-[200px]"
          style={{
            backgroundColor: "var(--tk-surface-container-lowest)",
            border: "1px solid color-mix(in srgb, var(--tk-outline-variant) 20%, transparent)",
            color: "var(--tk-on-surface)",
          }}
          aria-label="Enter text to analyze"
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Words", value: stats.words.toLocaleString() },
          { label: "Characters", value: stats.characters.toLocaleString() },
          { label: "Characters (no spaces)", value: stats.charactersNoSpaces.toLocaleString() },
          { label: "Sentences", value: stats.sentences.toLocaleString() },
          { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 p-4 rounded-card tonal-container"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {stat.label}
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-display text-primary tracking-tight">
              {stat.value}
            </span>
          </div>
        ))}

        {/* Reading time */}
        <div className="flex flex-col gap-1 p-4 rounded-card tonal-container">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Reading Time
          </span>
          <span className="text-base font-bold font-display text-tertiary tracking-tight">
            {stats.readingTime}
          </span>
          <span className="text-[10px] text-on-surface-variant/60">
            Speak: {stats.speakingTime}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={copyStats}
          disabled={!text}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm cursor-pointer transition-all hover:opacity-90 neon-gradient text-[#66002c] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <CopyIcon />
          Copy Stats
        </button>
      </div>

      {/* Info */}
      <div className="p-4 rounded-card tonal-container text-sm text-on-surface-variant leading-relaxed">
        <p className="font-semibold text-on-surface mb-1">About this tool</p>
        <p>
          All text processing happens entirely in your browser. Nothing is
          uploaded or stored. Reading time is estimated at 250 words per
          minute; speaking time at 183 words per minute.
        </p>
      </div>
    </div>
  );
}
