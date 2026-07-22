import { ThemeToggle } from "~/components/theme-toggle";

/**
 * Header — Minimal app header with logo/brand mark and theme toggle.
 *
 * - No background — allows content to bleed behind (per design system)
 * - Small footprint — doesn't compete with content
 * - Fixed at the top with a gradient fade at the bottom edge for readability
 * - Left: Toolhub wordmark / logo
 * - Right: Theme toggle button
 *
 * @example
 * <Header />
 */
export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 pt-3 pb-4"
      role="banner"
    >
      {/* Gradient fade for readability when content scrolls beneath */}
      <span
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--tk-surface-dim) 40%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Brand mark */}
      <a
        href="/"
        className="flex items-center gap-2 no-underline"
        aria-label="Toolhub — Home"
      >
        <span className="text-lg font-bold font-display text-on-surface tracking-tight select-none">
          Toolhub
        </span>
      </a>

      {/* Theme toggle */}
      <ThemeToggle />
    </header>
  );
}

export default Header;
