import type { Route } from "./+types/home";
import { ToolCard } from "~/components/tool-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Text & Data Tools — Toolhub" },
    {
      name: "description",
      content:
        "Word counter, diff checker, case converter, slug generator, and markdown preview — all in your browser.",
    },
  ];
}

function WordCountIcon() {
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

function DiffIcon() {
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
      <path d="M12 3v18" />
      <path d="M5 10l7-7 7 7" />
      <path d="M5 14l7 7 7-7" />
    </svg>
  );
}

function CaseIcon() {
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

function SlugIcon() {
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function MarkdownIcon() {
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="4 20 10 14 13 17 17 13 20 16" />
      <line x1="4" y1="8" x2="8" y2="8" />
    </svg>
  );
}

const TEXT_TOOLS = [
  {
    id: "word-count",
    name: "Word Counter",
    path: "/text/word-count",
    description: "Count words, characters, sentences, and paragraphs in any text",
    icon: <WordCountIcon />,
    badge: "Popular",
  },
  {
    id: "diff",
    name: "Diff Checker",
    path: "/text/diff",
    description: "Compare two texts side-by-side and highlight differences",
    icon: <DiffIcon />,
  },
  {
    id: "case-convert",
    name: "Case Converter",
    path: "/text/case-convert",
    description: "Transform text between UPPER, lower, Title, camelCase, and more",
    icon: <CaseIcon />,
  },
  {
    id: "slug",
    name: "Slug Generator",
    path: "/text/slug",
    description: "Generate URL-friendly slugs from any text input",
    icon: <SlugIcon />,
  },
  {
    id: "markdown",
    name: "Markdown Preview",
    path: "/text/markdown",
    description: "Write and preview markdown in real-time with live rendering",
    icon: <MarkdownIcon />,
    badge: "New",
  },
];

export default function TextHome() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <section className="flex flex-col gap-2 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-on-surface tracking-tight">
          Text & Data Tools
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Word counting, text comparison, case transformations, slug
          generation, and markdown previewing — all client-side and private.
        </p>
      </section>

      {/* Tool list */}
      <div className="flex flex-col gap-3">
        {TEXT_TOOLS.map((tool) => (
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
