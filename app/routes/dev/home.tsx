import type { Route } from "./+types/home";
import { ToolCard } from "~/components/tool-card";
import { JsonLd } from "~/components/json-ld";
import { ogMeta, collectionPageSchema, breadcrumbSchema } from "~/lib/seo";

export function meta({}: Route.MetaArgs) {
  const title = "Developer Tools — Toolhub";
  const description =
    "JSON formatter, UUID generator, base64 encoder/decoder, regex tester, cron parser, and JWT decoder for developers.";
  return [
    { title },
    { name: "description", content: description },
    ...ogMeta(title, description, "/dev"),
  ];
}

function JsonIcon() {
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

function UuidIcon() {
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
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function Base64Icon() {
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

function RegexIcon() {
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
      <path d="M17 3v18" />
      <path d="M7 3v18" />
      <path d="M3 7h18" />
      <path d="M3 17h18" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CronIcon() {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function JwtIcon() {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const DEV_TOOLS = [
  {
    id: "json",
    name: "JSON Formatter",
    path: "/dev/json",
    description: "Format, validate, and minify JSON payloads instantly",
    icon: <JsonIcon />,
    badge: "Popular",
  },
  {
    id: "uuid",
    name: "UUID Generator",
    path: "/dev/uuid",
    description: "Generate UUID v4, v7 and more in bulk with one click",
    icon: <UuidIcon />,
  },
  {
    id: "base64",
    name: "Base64 Encoder / Decoder",
    path: "/dev/base64",
    description: "Encode and decode base64 strings and files",
    icon: <Base64Icon />,
  },
  {
    id: "regex",
    name: "Regex Tester",
    path: "/dev/regex",
    description: "Test regular expressions with real-time match highlighting",
    icon: <RegexIcon />,
    badge: "New",
  },
  {
    id: "cron",
    name: "Cron Expression Parser",
    path: "/dev/cron",
    description: "Parse cron expressions and preview upcoming execution times",
    icon: <CronIcon />,
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    path: "/dev/jwt",
    description: "Decode JWT tokens and inspect header, payload, and signature",
    icon: <JwtIcon />,
  },
];

export default function DevHome() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in">
      {/* JSON-LD structured data */}
      <JsonLd data={collectionPageSchema("Developer Tools", "JSON formatter, UUID generator, base64 encoder/decoder, regex tester, cron parser, and JWT decoder.", "/dev")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Developer Tools", url: "/dev" },
      ])} />

      {/* Header */}
      <section className="flex flex-col gap-2 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-on-surface tracking-tight">
          Developer Tools
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          JSON utilities, UUID generation, base64 encoding, regex testing,
          cron parsing, and JWT inspection — all in your browser.
        </p>
      </section>

      {/* Tool list */}
      <div className="flex flex-col gap-3">
        {DEV_TOOLS.map((tool) => (
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
