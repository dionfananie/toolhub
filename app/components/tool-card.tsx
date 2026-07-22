import { useNavigate } from "react-router";
import type { ReactNode } from "react";

/**
 * Props for the ToolCard component.
 */
export interface ToolCardProps {
  /** Route to navigate to when clicked */
  to: string;
  /** SVG icon component (or any React node) */
  icon: ReactNode;
  /** Tool name */
  name: string;
  /** Short description of what the tool does */
  description: string;
  /** Optional badge text (e.g., "New", "Popular") */
  badge?: string;
}

/**
 * ToolCard — A smaller card representing an individual tool within a category.
 *
 * - Default state: tonal surface with card roundedness
 * - Hover state: glassmorphic (translucent + backdrop blur) with brightness shift
 * - Optional badge for "New" or "Popular" indicators using tertiary color
 *
 * @example
 * <ToolCard
 *   to="/financial/currency"
 *   icon={<DollarIcon />}
 *   name="Currency Converter"
 *   description="Convert between 170+ currencies with live rates"
 *   badge="Popular"
 * />
 */
export function ToolCard({
  to,
  icon,
  name,
  description,
  badge,
}: ToolCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group relative flex items-center gap-3 p-4 rounded-card tonal-container cursor-pointer text-left transition-all duration-200 hover:glass hover:brightness-110 focus-visible:outline-2 focus-visible:outline-primary"
      aria-label={`${name} — ${description}`}
    >
      {/* Icon */}
      <span
        className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
        style={{
          backgroundColor: "color-mix(in srgb, var(--tk-primary) 12%, transparent)",
          color: "var(--tk-primary)",
        }}
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-on-surface truncate">
            {name}
          </h4>
          {badge && (
            <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full text-tertiary">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-1">
          {description}
        </p>
      </div>

      {/* Chevron indicator */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-on-surface-variant group-hover:text-on-surface transition-colors shrink-0"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

export default ToolCard;
