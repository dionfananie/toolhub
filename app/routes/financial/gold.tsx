import type { Route } from "./+types/gold";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gold Price Tracker — Toolhub" },
    {
      name: "description",
      content:
        "Track real-time gold prices by weight, purity, and currency. Grams, ounces, tola — 24K, 22K, 21K, 18K, 14K.",
    },
  ];
}

export default function GoldPriceTracker() {
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
          <path d="M12 6v2m0 8v2" />
          <path d="M8 10c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" />
        </svg>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold font-display text-on-surface">
          Gold Price Tracker
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Real-time gold prices by weight, purity, and currency
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
            <span>View live gold prices per gram, ounce, or tola</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tertiary mt-0.5">&#8226;</span>
            <span>Select purity: 24K, 22K, 21K, 18K, 14K</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tertiary mt-0.5">&#8226;</span>
            <span>Auto-calculate total value as weight changes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tertiary mt-0.5">&#8226;</span>
            <span>See daily price change percentage and trends</span>
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
