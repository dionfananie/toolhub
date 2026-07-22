import type { Route } from "./+types/home";
import { ToolCard } from "~/components/tool-card";
import { JsonLd } from "~/components/json-ld";
import { ogMeta, collectionPageSchema, breadcrumbSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "Financial Tools — Toolhub";
  const description =
    "Currency converter, gold price tracker, tax calculator, loan calculator, and CAGR calculator — all in one place.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/financial"),
  ];
}

function CurrencyIcon() {
  return (
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" />
      <path d="M12 6v2m0 8v2" />
    </svg>
  );
}

function GoldIcon() {
  return (
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2m0 8v2" />
      <path d="M8 10c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" />
    </svg>
  );
}

function TaxIcon() {
  return (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function LoanIcon() {
  return (
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
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

const FINANCIAL_TOOLS = [
  {
    id: "currency",
    name: "Currency Converter",
    path: "/financial/currency",
    description: "Convert between 170+ currencies with live exchange rates",
    icon: <CurrencyIcon />,
    badge: "Popular",
  },
  {
    id: "gold",
    name: "Gold Price Tracker",
    path: "/financial/gold",
    description: "Real-time gold prices by weight, purity, and currency",
    icon: <GoldIcon />,
    badge: "New",
  },
  {
    id: "tax",
    name: "Tax Calculator (PPh)",
    path: "/financial/tax",
    description: "Calculate Indonesian PPh 21 with progressive brackets",
    icon: <TaxIcon />,
  },
  {
    id: "loan",
    name: "Loan Calculator",
    path: "/financial/loan",
    description: "Estimate monthly payments, interest, and amortization",
    icon: <LoanIcon />,
  },
  {
    id: "cagr",
    name: "CAGR Calculator",
    path: "/financial/cagr",
    description: "Compound annual growth rate from start to end value",
    icon: (
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
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

export default function FinancialHome() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in">
      {/* JSON-LD structured data */}
      <JsonLd data={collectionPageSchema("Financial Tools", "Currency converter, gold price tracker, tax calculator, loan calculator, and CAGR calculator.", "/financial")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Financial Tools", url: "/financial" },
      ])} />

      {/* Header */}
      <section className="flex flex-col gap-2 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-on-surface tracking-tight">
          Financial Tools
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Currency conversion, gold price tracking, tax calculations, and
          more — all powered by live data with clear timestamps.
        </p>
      </section>

      {/* Tool list */}
      <div className="flex flex-col gap-3">
        {FINANCIAL_TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            to={tool.path}
            icon={tool.icon}
            name={tool.name}
            description={tool.description}
            badge={tool.badge}
          />
        ))}
      </div>
    </div>
  );
}
