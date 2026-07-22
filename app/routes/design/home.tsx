import type { Route } from "./+types/home";
import { ToolCard } from "~/components/tool-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Design Assets — Toolhub" },
    {
      name: "description",
      content:
        "Download custom memojis, emoticons, stickers, and design assets for your projects. Sourced from original Figma designs.",
    },
  ];
}

/* ---------- SVG Icons ---------- */

function MemojiIcon() {
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
      <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path d="M8 16c0 0 1.5 2 4 2s4-2 4-2" />
    </svg>
  );
}

function PaletteIcon() {
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
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="17.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="16.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.5C20.5 15 22 13.5 22 11.5 22 6.5 17.5 2 12 2z" />
    </svg>
  );
}

const DESIGN_TOOLS = [
  {
    id: "memoji",
    name: "Memoji Downloader",
    path: "/design/memoji",
    description: "Browse and download custom emoticons, faces, objects, and decorative stickers",
    icon: <MemojiIcon />,
    badge: "New",
  },
  {
    id: "palette",
    name: "Color Palette Extractor",
    path: "/design/palette",
    description: "Extract color palettes from images and generate harmonious schemes",
    icon: <PaletteIcon />,
  },
];

export default function DesignHome() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <section className="flex flex-col gap-2 pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-on-surface tracking-tight">
          Design Assets
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          High-quality memojis, stickers, and design resources for your
          creative projects. Assets are designed in Figma and available
          for download as PNG/SVG.
        </p>
      </section>

      {/* Tool list */}
      <div className="flex flex-col gap-3">
        {DESIGN_TOOLS.map((tool) => (
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

      {/* Coming soon */}
      <div className="p-4 rounded-card tonal-container text-sm">
        <p className="font-semibold text-tertiary mb-1">
          &#10024; More assets coming soon
        </p>
        <p className="text-on-surface-variant">
          Icon previewer, gradient generator, and SVG optimization tools are
          in the pipeline. Stay tuned.
        </p>
      </div>
    </div>
  );
}
