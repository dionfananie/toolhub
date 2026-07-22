import { useNavigate } from "react-router";
import type { ReactNode } from "react";

/**
 * Props for the CategoryCard component.
 */
export interface CategoryCardProps {
  /** Route to navigate to when clicked */
  to: string;
  /** SVG icon component (or any React node) */
  icon: ReactNode;
  /** Category name */
  name: string;
  /** Number of tools in this category */
  toolCount: number;
  /** Brief description of the category */
  description: string;
  /** Optional accent color override for the icon (default: primary) */
  accentColor?: string;
}

/**
 * CategoryCard — A clickable card representing a tool category.
 *
 * Uses tonal layering (sits on surface-container) with subtle elevation
 * through background lightness. On hover, applies a brightness shift and
 * a neon glow inner border at 10% primary opacity.
 *
 * Pill-shaped corners (rounded-2xl), icon + category name + tool count
 * + brief description layout.
 *
 * @example
 * <CategoryCard
 *   to="/financial"
 *   icon={<CurrencyIcon />}
 *   name="Financial"
 *   toolCount={5}
 *   description="Currency, gold, tax & loan calculators"
 * />
 */
export function CategoryCard({
  to,
  icon,
  name,
  toolCount,
  description,
  accentColor,
}: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group relative flex flex-col gap-3 p-5 rounded-card tonal-container-highest cursor-pointer text-left transition-all duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-primary"
      aria-label={`${name} — ${toolCount} tools`}
    >
      {/* Neon inset border on hover */}
      <span
        className="absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accentColor ?? "var(--tk-primary)"} 10%, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Icon */}
      <span
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{
          backgroundColor: `color-mix(in srgb, ${accentColor ?? "var(--tk-primary)"} 15%, transparent)`,
          color: accentColor ?? "var(--tk-primary)",
        }}
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold font-display text-on-surface">
            {name}
          </h3>
          <span className="text-xs text-on-surface-variant font-medium tabular-nums">
            {toolCount}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </button>
  );
}

export default CategoryCard;
