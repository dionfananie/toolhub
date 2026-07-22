import type { Route } from "./+types/currency";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Currency Converter — Toolhub" },
    {
      name: "description",
      content:
        "Convert between 170+ currencies with live exchange rates. Real-time results as you type.",
    },
  ];
}

export default function CurrencyConverter() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 max-w-lg mx-auto pt-12 animate-fade-in">
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" />
          <path d="M12 6v2m0 8v2" />
        </svg>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold font-display text-on-surface">
          Currency Converter
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Convert between 170+ currencies with live exchange rates
        </p>
      </div>

      {/* Coming Soon */}
      <div className="w-full p-6 rounded-card tonal-container text-center">
        <p className="text-on-surface-variant text-sm">
          This tool is coming soon. You'll be able to:
        </p>
        <ul className="mt-3 space-y-2 text-left text-sm text-on-surface-variant">
          <li className="flex items-start gap-2">
            <span className="text-tertiary mt-0.5">&#8226;</span>
            <span>Convert between 170+ currencies with live rates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tertiary mt-0.5">&#8226;</span>
            <span>Auto-detect your local currency</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tertiary mt-0.5">&#8226;</span>
            <span>Swap between From/To currencies instantly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tertiary mt-0.5">&#8226;</span>
            <span>See last-updated timestamps for transparency</span>
          </li>
        </ul>
      </div>

      {/* Navigate back */}
      <a
        href="/financial"
        className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
      >
        &larr; Back to Financial Tools
      </a>
    </div>
  );
}
