import { Link } from "react-router";
import { formatBlogDate } from "~/lib/markdown";

/**
 * Props for the BlogCard component.
 */
export interface BlogCardProps {
  /** URL slug for the article */
  slug: string;
  /** Article title */
  title: string;
  /** Short description / excerpt */
  description: string;
  /** ISO date string (e.g. "2026-07-23") */
  date: string;
  /** Editorial category (e.g. "Developer Tools") */
  category: string;
  /** Tags displayed as small pills */
  tags: string[];
  /** Optional reading time in minutes */
  readingTime?: number | string;
}

/**
 * BlogCard — A card for displaying blog post previews in the listing page.
 *
 * States:
 * - **Default**: tonal container with `rounded-[24px]`, category badge in
 *   tertiary, date, title, description, and tag pills.
 * - **Hover**: glassmorphic effect (translucent + backdrop blur) with slight
 *   brightness scale transform.
 * - **Focus**: visible focus ring using `focus-visible:outline-primary`.
 *
 * @example
 * <BlogCard
 *   slug="design-token-figma-ke-code"
 *   title="Design Token: Dari Figma ke Code"
 *   description="Panduan setup design tokens dari Figma ke code base React + Tailwind."
 *   date="2026-07-23"
 *   category="Design Engineering"
 *   tags={["design-tokens", "figma", "tailwind"]}
 *   readingTime="8 min read"
 * />
 */
export function BlogCard({
  slug,
  title,
  description,
  date,
  category,
  tags,
  readingTime,
}: BlogCardProps) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group relative flex flex-col gap-3 p-5 rounded-[24px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary"
      style={{ backgroundColor: "var(--tk-surface-container-highest)" }}
      aria-label={`${title} — ${description}`}
    >
      {/* Hover glass overlay */}
      <span
        className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--tk-surface-variant) 50%, transparent)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
        aria-hidden="true"
      />

      {/* Hover brightness + slight scale */}
      <span
        className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in srgb, var(--tk-primary) 10%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Category badge + date row */}
      <div className="flex items-center justify-between gap-2 relative z-[1]">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-tertiary">
          {category}
        </span>
        <span className="text-[11px] text-on-surface-variant tabular-nums">
          {date ? formatBlogDate(date) : ""}
          {readingTime != null && date ? " · " : ""}
          {readingTime != null
            ? typeof readingTime === "number"
              ? `${readingTime} min read`
              : readingTime
            : ""}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold font-display text-on-surface leading-snug relative z-[1] group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 relative z-[1]">
          {description}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 relative z-[1] mt-auto pt-1">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium rounded-full"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--tk-primary) 8%, transparent)",
                color: "var(--tk-primary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default BlogCard;
