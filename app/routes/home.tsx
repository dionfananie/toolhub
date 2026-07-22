import type { Route } from "./+types/home";
import { CategoryCard } from "~/components/category-card";
import { ToolCard } from "~/components/tool-card";
import { JsonLd } from "~/components/json-ld";
import { useTheme } from "~/lib/theme-context";
import {
  ogMeta,
  webPageSchema,
  breadcrumbSchema,
} from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "Toolhub — Your Pocket Utility Belt";
  const description =
    "Your pocket utility belt — designed for speed, built with soul. Discover curated tools for finance, design, development, text, and conversion.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/"),
  ];
}

/**
 * Category definition for the homepage grid.
 */
interface Category {
  id: string;
  name: string;
  path: string;
  description: string;
  toolCount: number;
  icon: React.ReactNode;
}

/**
 * Tool definition for featured tools.
 */
interface FeaturedTool {
  id: string;
  name: string;
  path: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

/* ---------- SVG Icons ---------- */

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

function CodeIcon() {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function TextIcon() {
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
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  );
}

function ConvertIcon() {
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
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function DesignIcon() {
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
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M8 15c0 0 1.5 2 4 2s4-2 4-2" />
    </svg>
  );
}

function MathIcon() {
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
      <path d="M4 4h16v4H4z" />
      <path d="M4 10h8v10H4z" />
      <path d="M16 10h4v10h-4z" />
    </svg>
  );
}

/* ---------- Data ---------- */

const CATEGORIES: Category[] = [
  {
    id: "financial",
    name: "Financial",
    path: "/financial",
    description: "Currency conversion, gold prices, tax & loan calculators",
    toolCount: 5,
    icon: <CurrencyIcon />,
  },
  {
    id: "developer",
    name: "Developer",
    path: "/dev",
    description: "JSON tools, UUIDs, base64, regex, cron expressions",
    toolCount: 6,
    icon: <CodeIcon />,
  },
  {
    id: "text",
    name: "Text & Data",
    path: "/text",
    description: "Word counter, diff checker, case converter, markdown",
    toolCount: 6,
    icon: <TextIcon />,
  },
  {
    id: "design",
    name: "Design Assets",
    path: "/design",
    description: "Memojis, stickers, color palettes & design resources",
    toolCount: 2,
    icon: <DesignIcon />,
  },
  {
    id: "convert",
    name: "Converters",
    path: "/convert",
    description: "PDF scanning, JSON to CSV, numeral conversion & more",
    toolCount: 3,
    icon: <ConvertIcon />,
  },
  {
    id: "math",
    name: "Math & Stats",
    path: "/math",
    description: "Percentages, tips, random numbers, statistical summaries",
    toolCount: 4,
    icon: <MathIcon />,
  },
];

const FEATURED_TOOLS: FeaturedTool[] = [
  {
    id: "currency",
    name: "Currency Converter",
    path: "/financial/currency",
    description: "Live exchange rates for 170+ currencies",
    icon: <CurrencyIcon />,
    badge: "Popular",
  },
  {
    id: "gold",
    name: "Gold Price Tracker",
    path: "/financial/gold",
    description: "Real-time gold prices by weight and purity",
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v2m0 8v2" />
        <path d="M8 10c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" />
      </svg>
    ),
    badge: "New",
  },
  {
    id: "uuid",
    name: "UUID Generator",
    path: "/dev/uuid",
    description: "Generate v4 and v7 UUIDs in bulk",
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
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "json",
    name: "JSON Formatter",
    path: "/dev/json",
    description: "Validate, format, and minify JSON payloads",
    icon: <CodeIcon />,
  },
  {
    id: "memoji",
    name: "Memoji Downloader",
    path: "/design/memoji",
    description: "Download custom emoticons and stickers from Figma",
    icon: <DesignIcon />,
    badge: "New",
  },
];

/* ---------- Component ---------- */

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-10 sm:gap-14 max-w-5xl mx-auto animate-fade-in">
      {/* JSON-LD structured data */}
      <JsonLd data={webPageSchema("Toolhub — Your Pocket Utility Belt", "Your pocket utility belt — curated tools for finance, design, development, text, and conversion.", "/")} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "/" }])} />

      {/* Hero Section */}
      <section className="flex flex-col gap-4 pt-8 sm:pt-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-on-surface tracking-tight leading-tight">
          Toolhub
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
          Your pocket utility belt — designed for speed, built with soul.
        </p>
      </section>

      {/* Search Bar (UI only) */}
      <div className="relative w-full max-w-xl">
        <div className="flex items-center gap-3 px-4 py-3 rounded-full tonal-container-high text-on-surface-variant">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 shrink-0"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="flex-1 text-sm opacity-60">Search tools...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full text-on-surface-variant">
            <span className="text-xs">&#8984;</span>K
          </kbd>
        </div>
      </div>

      {/* Category Gallery */}
      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold font-display text-on-surface">
          Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              to={category.path}
              icon={category.icon}
              name={category.name}
              toolCount={category.toolCount}
              description={category.description}
            />
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold font-display text-on-surface">
            Curated Picks
          </h2>
          <span className="text-xs text-on-surface-variant font-medium">
            Editor's choice
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURED_TOOLS.map((tool) => (
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
      </section>

      {/* Footer hint */}
      <footer className="pb-4 text-center">
        <p className="text-xs text-on-surface-variant">
          {CATEGORIES.reduce((sum, c) => sum + c.toolCount, 0)} tools across{" "}
          {CATEGORIES.length} categories
        </p>
      </footer>
    </div>
  );
}
